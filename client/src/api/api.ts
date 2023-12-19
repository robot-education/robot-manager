/**
 * Makes a post request to the backend.
 */
export async function post(
    path: string,
    query: Record<string, string> = {},
    body: object = {}
): Promise<any> {
    path = "/api" + path;
    if (query) {
        path += `?${new URLSearchParams(query)}`;
    }
    return fetch(path, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }).then((res) => {
        if (!res.ok) { throw res; }
        return res.json();
    }).catch(() => null);
}
