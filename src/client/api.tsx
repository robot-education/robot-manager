/**
 * Makes a post request to the backend.
 */
export async function post(
    apiPath: string,
    body: object = {},
    query: Record<string, string> = {},
): Promise<any> {
    try {
        let normalizedUrl = `/api/${apiPath}`;
        if (query) {
            normalizedUrl += `?${new URLSearchParams(query)}`;
        }
        return fetch(normalizedUrl, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }).then(response => response.json());
    } catch (error) {
        return Promise.reject(error);
    }
}

interface ElementPath {
    documentId: string;
    workspaceOrVersion: string;
    workspaceId: string;
    elementId: string;
}

export function getElementPath(): ElementPath {
    const query = new URLSearchParams(window.location.search);
    return {
        documentId: query.get("documentId") ?? "",
        workspaceOrVersion: query.get("workspaceOrVersion") ?? "w",
        workspaceId: query.get("workspaceId") ?? "",
        elementId: query.get("elementId") ?? "",
    };
}
