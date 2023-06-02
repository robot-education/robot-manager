export function fastenMate(name: string, queries: object[], mateConnectors: object[] | undefined = undefined): object {
    return {
        type: 64,
        version: 2,
        message: {
            featureType: "mate",
            name: name,
            mateConnectors,
            parameters: [
                mateTypeParameter("FASTENED"),
                queryParameter(
                    "mateConnectorsQuery",
                    queries),
                // necessary to prevent bug with axis flip
                primaryAxisParameter("primaryAxisAlignment")
            ]
        }
    };
}

function queryParameter(parameterId: string, queries: object[]): object {
    return {
        type: 67,
        message: {
            parameterId,
            queries
        }
    }
}

/**
 * A query for an existing mate connector.
 * @param instanceId : The id of the assembly instance the mate connector belongs to. May also be a path to work with subassemblies.
 * @param mateId : The id of the mate. This is roughly based on the ids of the feature which constructed the mate.
 */
export function partStudioMateConnectorQuery(instanceId: string, mateId: string): object {
    return {
        type: 1324,
        message: {
            featureId: mateId,
            path: [instanceId]
        }
    };
}

/**
 * A query for a feature like an explicit mate connector.
 */
export function featureQuery(featureId: string, queryData: string | undefined = undefined, path: string[] = []): object {
    return {
        type: 157,
        message: {
            queryData,
            featureId,
            path
        }
    };
}

function originQuery(): object {
    return featureQuery("Origin", "ORIGIN_Z");
}

/**
 * @param value The type of the mate. `FASTENED`, `ROTATE`, etc.
 */
function mateTypeParameter(value: string): object {
    return {
        type: 145,
        message: {
            parameterId: "mateType",
            value,
            enumName: "Mate type" // required...
        }
    };
}

function primaryAxisParameter(parameterId: string): object {
    return {
        type: 144,
        message: {
            parameterId: parameterId,
            value: false
        }
    };
}

function originTypeParameter(): object {
    return {
        type: 145,
        message: {
            parameterId: "originType",
            enumName: "Origin type",
            value: "ON_ENTITY"
        }
    }
}

export function originMateConnector(): object {
    return {
        type: 66,
        message: {
            featureType: "mateConnector",
            isHidden: true,
            isAuxiliaryTreeMateConnector: false,
            name: "Mate connector",
            parameters: [
                originTypeParameter(),
                queryParameter("originQuery", [originQuery()]),
                primaryAxisParameter("flipPrimary")
            ]
        }
    }
}

// {
//       "btType": "BTMMate-64",
//       "featureType": "mate",
//       "mateConnectors": [
//         {
//           "btType": "BTMMateConnector-66",
//           "featureType": "mateConnector",
//           "isHidden": true,
//           "isAuxiliaryTreeMateConnector": false,
//           "implicit": true,
//           "name": "Mate connector",
//           "version": 4,
//           "nodeId": "MefQ5JMAH6COcrZfT",
//           "namespace": "",
//           "suppressed": false,
//           "parameters": [
//             {
//               "btType": "BTMParameterEnum-145",
//               "nodeId": "Mnz2WGRCS3Zl8zJta",
//               "namespace": "",
//               "value": "ON_ENTITY",
//               "enumName": "Origin type",
//               "parameterId": "originType"
//             },
//             {
//               "btType": "BTMParameterQueryWithOccurrenceList-67",
//               "queries": [
//                 {
//                   "btType": "BTMFeatureQueryWithOccurrence-157",
//                   "queryData": "ORIGIN_Z",
//                   "featureId": "Origin",
//                   "path": [],
//                   "nodeId": "FTdz3NutJPd9H8K"
//                 }
//               ],
//               "parameterId": "originQuery",
//               "nodeId": "MKny9JVF3TrKjpiVF"
//             },