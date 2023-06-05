/**
 * Makes a post request to the backend.
 */
export async function post(
    apiPath: string,
    body: object = {},
    query: Record<string, string | boolean> = {}
): Promise<any> {
    try {
        // @ts-ignore
        const normalizedUrl = `https://localhost:3000/api/${apiPath}?` + new URLSearchParams(query ?? {});
        const result = await fetch(normalizedUrl, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        return await result.json();
    } catch (err) {
        return { error: err };
    }
}

interface ElementPath {
    documentId: string,
    workspaceOrVersion: string,
    workspaceId: string,
    elementId: string
}

export function makeElementPath(): ElementPath {
    const query = new URLSearchParams(window.location.search);
    return {
        documentId: query.get("documentId") ?? "",
        workspaceId: query.get("workspaceId") ?? "",
        workspaceOrVersion: query.get("workspaceOrVersion") ?? "",
        elementId: query.get("elementId") ?? "",
    };
}