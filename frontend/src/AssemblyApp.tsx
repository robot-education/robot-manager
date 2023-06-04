import React from "react";

import {
    Navbar,
    NavbarGroup,
    NavbarHeading,
    Button,
    Card,
    H5,
    // ProgressBar,
} from "@blueprintjs/core";

export function AssemblyApp(): JSX.Element {
    return (<>
        <Navbar>
            <NavbarGroup>
                <NavbarHeading>Robot manager</NavbarHeading>
            </NavbarGroup>
        </Navbar>
        <Card>
            <H5>Auto assembly</H5>
            <p>
                Execute the auto assembly script on parts in the current assembly.
            </p>
            {/* <Checkbox label="Resolve assembly mirror" /> */}
            <Button text="Execute" intent="primary" type="submit" rightIcon="arrow-right" onClick={executeAutoAssembly} />
        </Card>
    </>);
}

export async function executeAutoAssembly() {
    const query = new URLSearchParams(window.location.search);
    const body = {
        documentId: query.get("documentId"),
        workspaceId: query.get("workspaceId"),
        workspaceOrVersion: query.get("workspaceOrVersion"),
        elementId: query.get("elementId"),
    };
    const result = await post("autoassembly", body);
    console.log(result);
}

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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        });
        return await result.json();
    } catch (err) {
        return { error: err };
    }
}