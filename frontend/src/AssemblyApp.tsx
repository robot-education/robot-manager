import React, { useCallback } from "react";

import {
    Button,
    Card,
    H5,
    // ProgressBar,
} from "@blueprintjs/core";

import { AppNavbar } from "./AppNavbar";
import { makeElementPath, post } from "./api";

export function AssemblyApp(): JSX.Element {
    const executeAutoAssembly = useCallback(async () => {
        const result = await post("auto-assembly", makeElementPath());
        console.log(result);
    }, []);

    return (<>
        <AppNavbar />
        <Card>
            <H5>Execute auto assembly</H5>
            <p>
                Execute the auto assembly script on parts in the current assembly.
            </p>
            {/* <Checkbox label="Resolve assembly mirror" /> */}
            <Button text="Execute" intent="primary" type="submit" rightIcon="arrow-right" onClick={executeAutoAssembly} />
        </Card>
    </>);
}

