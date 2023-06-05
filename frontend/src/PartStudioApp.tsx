import React, { useCallback, useState } from "react";

import {
    Button,
    Card,
    Checkbox,
    FormGroup,
    H5,
    InputGroup,
    Tooltip,
} from "@blueprintjs/core";

import { AppNavbar } from "./AppNavbar";
import { makeElementPath, post } from "./api";

export function PartStudioApp(): JSX.Element {
    const [autoAssemble, setAutoAssemble] = useState(true);
    const [assemblyName, setAssemblyName] = useState("Assembly");
    const executeGenerateAssembly = useCallback(async () => {
        const assembly = await post("generate-assembly", { ...makeElementPath(), name: assemblyName });
        if (autoAssemble) { await post("auto-assembly", assembly); }
    }, [autoAssemble, assemblyName]);

    return (<>
        <AppNavbar />
        <Card>
            <H5>Generate assembly</H5>
            <p>
                Generate an assembly of the current part studio.
            </p>
            <FormGroup
                label="Assembly name"
                labelFor="assembly-name"
                labelInfo="(required)"
            >
                <Tooltip content={"The name of the generated assembly"}>
                    <InputGroup id="assembly-name" value={assemblyName} onChange={handleStringChange(setAssemblyName)} />
                </Tooltip>
            </FormGroup>
            <FormGroup
                label="Execute auto assembly"
                labelFor="auto-assemble"
                inline={true}
            >
                <Tooltip content={"Whether to execute the auto assembly script on the generated assembly"}>
                    <Checkbox id="auto-assemble" checked={autoAssemble} onClick={handleBooleanChange(setAutoAssemble)} />
                </Tooltip>
            </FormGroup>
            <Button text="Execute" intent="primary" type="submit" rightIcon="arrow-right" onClick={executeGenerateAssembly} />
        </Card >
    </>);
}

/** Event handler that exposes the target element's value as a boolean. */
export function handleBooleanChange(handler: (checked: boolean) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).checked);
}

/** Event handler that exposes the target element's value as a string. */
export function handleStringChange(handler: (value: string) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value);
}