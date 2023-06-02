import React from "react";

import { config } from "dotenv";
config();

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
        {/* <ProgressBar intent="primary" value={0.2} /> */}
        <Card>
            <H5>Auto assembly</H5>
            <p>
                Execute the auto assembly script on parts in the current assembly.
            </p>
            {/* <Checkbox label="Resolve assembly mirror" /> */}
            <Button text="Execute" intent="primary" type="submit" rightIcon="arrow-right" />
        </Card>
    </>);
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
    const backendUrl = process.env.BACKEND_URL;
    try {
        // @ts-ignore
        const normalizedUrl = `${backendUrl}/${apiPath}` + new url.URLSearchParams(query ?? {});
        return await fetch(normalizedUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                // @ts-ignore
                Authorization: `Bearer ${req.user.accessToken}`,
            },
            body: JSON.stringify(body),
        });
    } catch (err) {
        return { error: err };
    }
}