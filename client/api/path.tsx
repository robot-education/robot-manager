export class ElementPath {
    constructor(
        public documentId: string,
        public workspaceOrVersion: string,
        public workspaceId: string,
        public elementId: string
    ) { }

    public toQuery(pathType: PathType): Record<string, string> {
        switch (pathType) {
            case PathType.DOCUMENT_BASE:
                return this.toDocumentQuery();
            case PathType.DOCUMENT:
                return this.toDocumentQuery();
            case PathType.ELEMENT:
                return this.toElementQuery();
        }
    }

    public toDocumentBaseQuery(): Record<string, string> {
        return {
            documentId: this.documentId
        };
    }

    public toDocumentQuery(): Record<string, string> {
        return {
            ...this.toDocumentBaseQuery(),
            workspaceOrVersion: this.workspaceOrVersion,
            workspaceId: this.workspaceId
        };
    }

    public toElementQuery(): Record<string, string> {
        return {
            ...this.toDocumentQuery(),
            elementId: this.elementId
        };
    }
}

/**
 * Returns the path to the current open window.
 */
export function getCurrentPath(): ElementPath {
    const query = new URLSearchParams(window.location.search);
    return new ElementPath(
        query.get("documentId") ?? "",
        query.get("workspaceOrVersion") ?? "w",
        query.get("workspaceId") ?? "",
        query.get("elementId") ?? "",
    );
}

export enum PathType {
    DOCUMENT_BASE,
    DOCUMENT,
    ELEMENT
}


export function currentPathQuery(pathType: PathType = PathType.ELEMENT): Record<string, string> {
    return getCurrentPath().toQuery(pathType);
}