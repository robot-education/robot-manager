// eslint-disable-next-line no-unused-vars
async function execute() {
    const params = new URLSearchParams(window.location.search);
    // const resp = await fetch(`/api/gltf${evt.target.options[event.target.selectedIndex].getAttribute("href")}`);
    await fetch(`/api/executeAutoAssembly`, {
        method: "POST",
        mode: "cors", // body
        headers: {
            "Content-Type": "application/json", // body
            // bad things happen if excluded?
            "Accept": "application/json"
        },
        body: JSON.stringify({
            documentId: params.get("documentId"),
            workspaceId: params.get("workspaceId"),
            elementId: params.get("elementId")
        }) // body
    });
}
