import * as express from "express";
import * as url from "url";
import * as config from "../config";

export interface Path { }

export class DocumentPath implements Path {
    constructor(
        public documentId: string,
        public workspaceId: string,
        public workspaceOrVersion: string = "w"
    ) { }

    toString(): string {
        return `/d/${this.documentId}/${this.workspaceOrVersion}/${this.workspaceId}`;
    }
}

export class ElementPath implements Path {
    constructor(
        public documentPath: DocumentPath,
        public elementId: string
    ) { }

    toString(): string {
        return this.documentPath + `/e/${this.elementId}`;
    }
}

export interface PartPath {
    partId: string;
    path: string;
}

export interface ElementPathObject {
    documentId: string;
    workspaceId: string;
    elementId: string;
}

export function makeElementPath(pathObject: ElementPathObject): ElementPath {
    return new ElementPath(new DocumentPath(pathObject.documentId, pathObject.workspaceId), pathObject.elementId);
}

export interface VariablePathObject {
    documentId: string;
    documentVersion?: string;
    documentMicroversion?: string;
    elementId: string;
}

export function makeVariableElementPath(pathObject: VariablePathObject, workspaceId: string): ElementPath {
    if (pathObject.documentVersion) {
        return new ElementPath(new DocumentPath(pathObject.documentId, pathObject.documentVersion, "v"), pathObject.elementId);
    }
    else if (pathObject.documentMicroversion) {
        // inject workspace id
        return new ElementPath(new DocumentPath(pathObject.documentId, workspaceId), pathObject.elementId);
    }
    throw new Error("Path object does not have valid arguments.");
}

export function apiPath(
    service: string,
    path: Path,
    secondaryService?: string
): string {
    let str = `${service}` + path;
    if (secondaryService) {
        str += `/${secondaryService}`;
    }
    return str;
}

export type Request = express.Request;

/*
 * Sends the request to the Onshape API. 
 */
export async function get(
    req: Request,
    apiPath: string,
    query: Record<string, string | boolean> = {}
): Promise<any> {
    try {
        // @ts-ignore
        const normalizedUrl = `${config.onshapeApiUrl}/${apiPath}?` + new url.URLSearchParams(query ?? {});
        const result = await fetch(normalizedUrl, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                // @ts-ignore
                Authorization: `Bearer ${req.user.accessToken}`,
            },
        });
        return result.json();
    } catch (err) {
        return { error: err };
    }
}

/**
 * Makes a post request to the Onshape API.
 * 
 * @param jsonResponse : Whether the response is parseable as JSON. 
 */
export async function post(
    req: Request,
    apiPath: string,
    body: object = {},
    query: Record<string, string | boolean> = {},
    jsonResponse: boolean = true,
): Promise<any> {
    try {
        // @ts-ignore
        const normalizedUrl = `${config.onshapeApiUrl}/${apiPath}` + new url.URLSearchParams(query ?? {});
        const result = await fetch(normalizedUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                // @ts-ignore
                Authorization: `Bearer ${req.user.accessToken}`,
            },
            body: JSON.stringify(body),
        });
        // try-catch doesn't work with .json...
        if (jsonResponse) { return result.json(); }
        else { return null; }
    } catch (err) {
        return { error: err };
    }
}