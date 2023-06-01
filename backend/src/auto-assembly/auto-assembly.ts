import * as api from "../api/api";
import * as assemblyApi from "../api/assembly-api";
import * as assemblyFeature from "../api/assembly-feature";
import * as assemblyScript from "./assembly-script";

/**
 * TODOs:
 * Auto mirror
 * Target sub assemblies
 * - Base edge queries
 * - Target edge queries
 * Fasten sub mates
 * Replicate
 * Mate connector offsets
 * Auto mirror - auto assembly
 * 
 * I'll keep auto assembly code in JS
 * Code utils will be Python ofc
 * I can write api calls and route through a python server, sure
 */

/**
 * Executes auto assembly.
 * 
 * Procedure:
 * 1. Collect unique assembly parts.
 * 2. Group assembly parts by part studio.
 * 3. Evaluate each part studio. 
 * 4. For each part, determine if it has a valid target.
 * 5. Group targets together. (optional) Group targets by part studio. 
 * 6. Evaluate each target part studio.
 * 8. For each instance of each part in the assembly with one or more targets, instantiate and mate each target.
 */
export async function execute(req: api.Request) {
    console.log("Executing auto assembly");
    const assemblyPath = api.makeElementPath(req.body);
    const workspaceId = assemblyPath.documentPath.workspaceId;

    const assembly = await assemblyApi.getAssembly(req, assemblyPath);

    if (assembly.error) {
        console.log("Not an assembly");
        return;
    }

    const parts = assembly.parts;
    const partStudioPaths = groupPaths(parts, workspaceId);
    const partToMatesMap = mapPartsToMateConnectors(parts, workspaceId);

    let promises: Promise<void>[] = [];
    let mateToTargetMap: Map<string, api.ElementPath> = new Map(); // maps mate ids to target paths
    let mirrorMates: Map<string, string> = new Map(); // maps start mates to end mates

    for (const partPath of partStudioPaths) {
        const promise = evalutePart(req, partPath).then((partResult) => {
            if (!partResult.valid) { return; }
            for (const values of partResult.mates) {
                mateToTargetMap.set(values.mateId, api.makeElementPath(values));
            }
            for (const mirror of partResult.mirrors) {
                mirrorMates.set(mirror.startMateId, mirror.endMateId);
            }
        });
        promises.push(promise);
    }
    await Promise.all(promises);

    // evaluate targets, map mate ids to target mate connector ids
    const mateToMateConnector = await evaluteTargets(req, mateToTargetMap);

    // instantiate instances
    const newInstanceCount = addInstances(req, assembly, assemblyPath, workspaceId, partToMatesMap,
        mateToTargetMap, mateToMateConnector, mirrorMates);

    promises = [];
    const updatedAssembly = await assemblyApi.getAssembly(req, assemblyPath);
    const updatedInstances = updatedAssembly.rootAssembly.instances;
    const newInstances = updatedInstances.slice(-newInstanceCount);

    // old instances - same logic as above
    for (const instance of assembly.rootAssembly.instances) {
        const mateIds = getPartMateIds(instance, workspaceId, partToMatesMap);
        for (const mateId of mateIds) {
            const targetPath = mateToTargetMap.get(mateId);
            const targetMateConnector = mateToMateConnector.get(mateId);
            if (targetPath && targetMateConnector) {
                const newInstance = findMatchingInstance(newInstances, workspaceId, targetPath);
                console.log("Fasten mate!");
                const queries = [
                    // target first means target stays more of the time
                    assemblyFeature.partStudioMateConnectorQuery(newInstance.id, targetMateConnector),
                    assemblyFeature.partStudioMateConnectorQuery(instance.id, mateId)
                ];
                const fastenMate = assemblyFeature.fastenMate("Auto mate", queries);
                promises.push(assemblyApi.addAssemblyFeature(req, assemblyPath, fastenMate));
            }
            else if (mirrorMates.has(mateId)) {
                const startMateId = mirrorMates.get(mateId) ?? ""; // guaranteed to find

                // TODO: Update findMatchingInstance to also check pathId in this case
                const targetPath = api.makeVariableElementPath(instance, workspaceId);
                const newInstance = findMatchingInstance(newInstances, workspaceId, targetPath);
                console.log("Mirror mate!");
                const queries = [
                    assemblyFeature.partStudioMateConnectorQuery(newInstance.id, mateId),
                    assemblyFeature.partStudioMateConnectorQuery(instance.id, startMateId)
                ];
                const fastenMate = assemblyFeature.fastenMate("Mirror mate", queries);
                promises.push(assemblyApi.addAssemblyFeature(req, assemblyPath, fastenMate));
            }
        }
    }

    await Promise.all(promises);
    console.log("Finished!");
}


async function evaluteTargets(req: api.Request, mateToTargetMap: Map<string, api.ElementPath>): Promise<Map<string, string>> {
    let promises = [];
    let mateToMateConnector: Map<string, string> = new Map(); // maps mate ids to target mate connectors
    for (const [mateId, path] of mateToTargetMap) {
        promises.push(evaluteTarget(req, path).then((targetResult) => {
            mateToMateConnector.set(mateId, targetResult.targetMateId);
        }));
    }
    await Promise.all(promises);
    return mateToMateConnector;
}

/**
 * Fetches the mate ids of a part. Returns [] if the instance doesn't have any mates or isn't a part.
 */
function getPartMateIds(instance: any, workspaceId: string, partToMatesMap: Map<string, string[]>): string[] {
    if (instance.type !== "Part") { return []; }
    const key = makePartKey(instance, workspaceId);
    return partToMatesMap.get(key) ?? [];
}

function makePartKey(part: any, workspaceId: string): string {
    return JSON.stringify({ path: api.makeVariableElementPath(part, workspaceId).toString(), partId: part.partId });
}

function groupPaths(parts: any[], workspaceId: string): Set<api.ElementPath> {
    return new Set<api.ElementPath>(parts.map(part => api.makeVariableElementPath(part, workspaceId)));
}

/**
 * Constructs a map which maps individual part keys to a list of the ids of the mate connectors they own.
 */
function mapPartsToMateConnectors(parts: any[], workspaceId: string): Map<string, string[]> {
    let map: Map<string, string[]> = new Map();
    parts.forEach(part => {
        if (!part.mateConnectors) { return; }
        const key = makePartKey(part, workspaceId);
        for (const mateConnector of part.mateConnectors) {
            const values = map.get(key) ?? [];
            values.push(mateConnector.featureId);
            map.set(key, values);
        }
    });
    return map;
}

async function addInstances(req: api.Request,
    assembly: any,
    assemblyPath: api.ElementPath,
    workspaceId: string,
    partToMatesMap: Map<string, string[]>,
    mateToTargetMap: Map<string, api.ElementPath>,
    mateToMateConnector: Map<string, string>,
    mirrorMates: Map<string, string>): Promise<number> {
    let promises = [];
    for (const instance of assembly.rootAssembly.instances) {
        const mateIds = getPartMateIds(instance, workspaceId, partToMatesMap);
        for (const mateId of mateIds) {
            const targetPath = mateToTargetMap.get(mateId);
            const targetMateConnector = mateToMateConnector.get(mateId);
            if (targetPath && targetMateConnector) {
                promises.push(assemblyApi.addPartStudio(req, assemblyPath, targetPath));
            }
            else if (mirrorMates.has(mateId)) {
                const targetPath = api.makeVariableElementPath(instance, workspaceId);
                promises.push(assemblyApi.addPart(req, assemblyPath, targetPath, instance.partId));
            }
        };
    }

    const newInstanceCount = promises.length;
    await Promise.all(promises);
    return newInstanceCount;
}

export function findMatchingInstance(newInstances: any[], workspaceId: string, targetPath: api.ElementPath): any {
    for (const i in newInstances) {
        const newInstance = newInstances[i];
        const newPath = api.makeVariableElementPath(newInstance, workspaceId);
        if (newPath.toString() === targetPath.toString()) {
            newInstances.splice(Number(i), 1);
            return newInstance;
        }
    }
    throw new Error("Failed to find instantiated instance.");
}

export async function evalutePart(req: api.Request, partStudioPath: api.ElementPath) {
    return assemblyApi.evaluateFeatureScript(req, partStudioPath, assemblyScript.parseBaseScript);
}

export async function evaluteTarget(req: api.Request, partStudioPath: api.ElementPath) {
    return assemblyApi.evaluateFeatureScript(req, partStudioPath, assemblyScript.parseTargetScript);
}