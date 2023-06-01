import api from "./api";

/**
 * Fetches elements of an assembly.
 */
export async function getAssembly(req: api.Request, path: api.ElementPath): Promise<any> {
    const query = { includeNonSolids: false, includeMateFeatures: true, includeMateConnectors: true, excludeSuppressed: true };
    return api.get(req, api.apiPath("assemblies", path), query);
}

/**
 * Evaluates the given FeatureScript against the given partStudioPath.
 * @returns The console output of the FeatureScript parsed as JSON.
 */
export async function evaluateFeatureScript(req: api.Request, partStudioPath: api.ElementPath, script: string): Promise<any> {
    const result = await api.post(req, api.apiPath("partstudios", partStudioPath, "featurescript"), { "script": script });
    try {
        return JSON.parse(result.console);
    }
    catch {
        return { error: "Failed to evaluate FeatureScript.", details: result };
    };
}

export async function addPart(req: api.Request, assemblyPath: api.ElementPath, partStudioPath: api.ElementPath, partId: string): Promise<void> {
    const body = {
        documentId: partStudioPath.documentPath.documentId,
        workspaceId: partStudioPath.documentPath.workspaceId,
        elementId: partStudioPath.elementId,
        isAssembly: false,
        isWholePartStudio: false,
        includePartTypes: ["PARTS"],
        partId: partId
    };
    return api.post(req, api.apiPath("assemblies", assemblyPath, "instances"), body, {}, false);
}

/**
 * Adds a part studio to an assembly.
 */
export async function addPartStudio(req: api.Request, assemblyPath: api.ElementPath, partStudioPath: api.ElementPath): Promise<void> {
    const body = {
        documentId: partStudioPath.documentPath.documentId,
        workspaceId: partStudioPath.documentPath.workspaceId,
        elementId: partStudioPath.elementId,
        isAssembly: false,
        isWholePartStudio: true,
        includePartTypes: ["PARTS"]
    };

    return api.post(req, api.apiPath("assemblies", assemblyPath, "instances"), body, {}, false);
}

export async function addAssemblyFeature(req: api.Request, assemblyPath: api.ElementPath, feature: any): Promise<any> {
    return api.post(req, api.apiPath("assemblies", assemblyPath, "features"), { feature });
}