import React, { useState } from "react";

import {
    Button,
    Card,
    Checkbox,
    FormGroup,
    H4,
    InputGroup,
    Tooltip,
} from "@blueprintjs/core";

import { AppNavbar } from "./app-navbar";
import { getElementPath as getElementPath, post } from "./api";
import { ApiDialog, MenuState } from "./api-dialog";

export function PartStudioApp(): JSX.Element {
    const [autoAssemble, setAutoAssemble] = useState(true);
    const [assemblyName, setAssemblyName] = useState("Assembly");
    const [assemblyUrl, setAssemblyUrl] = useState<string | undefined>();
    const [menuState, setMenuState] = useState(MenuState.CLOSED);

    const executeGenerateAssembly = async () => {
        setMenuState(MenuState.EXECUTING);
        const elementPath = getElementPath();
        const result = await post("generate-assembly", {
            ...elementPath,
            name: assemblyName,
        });
        const assemblyPath = { ...elementPath, elementId: result.elementId };
        setAssemblyUrl(
            `https://cad.onshape.com/documents/${assemblyPath.documentId}/w/${assemblyPath.workspaceId}/e/${assemblyPath.elementId}`
        );
        if (autoAssemble) {
            await post("auto-assembly", assemblyPath);
        }
        setMenuState(MenuState.FINISHED);
    };

    const openAssembly = (
        <Button
            text="Open assembly"
            intent="primary"
            icon="share"
            onClick={() => {
                window.open(assemblyUrl);
                setMenuState(MenuState.CLOSED);
            }}
        />
    );

    const executeDialog = (
        <ApiDialog
            menuState={menuState}
            setMenuState={setMenuState}
            title="Generate assembly"
            loadingMessage="Generating assembly"
            successMessage="Successfully generated assembly"
            successDescription="Remember to fix a part in the assembly to lock it in place."
            additionalActions={openAssembly}
        />
    );

    return (
        <>
            <AppNavbar />
            <Card>
                <H4>Generate assembly</H4>
                <p>Generate an assembly from the current part studio.</p>
                <FormGroup
                    label="Assembly name"
                    labelFor="assembly-name"
                    labelInfo="(required)"
                >
                    <Tooltip content={"The name of the generated assembly"}>
                        <InputGroup
                            id="assembly-name"
                            value={assemblyName}
                            onChange={handleStringChange(setAssemblyName)}
                        />
                    </Tooltip>
                </FormGroup>
                <FormGroup
                    label="Execute auto assembly"
                    labelFor="auto-assemble"
                    inline={true}
                >
                    <Tooltip
                        content={
                            "Whether to execute auto assembly on the generated assembly"
                        }
                    >
                        <Checkbox
                            id="auto-assemble"
                            checked={autoAssemble}
                            onClick={handleBooleanChange(setAutoAssemble)}
                        />
                    </Tooltip>
                </FormGroup>
                <Button
                    text="Execute"
                    intent="primary"
                    type="submit"
                    rightIcon="arrow-right"
                    onClick={executeGenerateAssembly}
                />
            </Card>
            {executeDialog}
        </>
    );
}

/** Event handler that exposes the target element's value as a boolean. */
export function handleBooleanChange(handler: (checked: boolean) => void) {
    return (event: React.FormEvent<HTMLElement>) =>
        handler((event.target as HTMLInputElement).checked);
}

/** Event handler that exposes the target element's value as a string. */
export function handleStringChange(handler: (value: string) => void) {
    return (event: React.FormEvent<HTMLElement>) =>
        handler((event.target as HTMLInputElement).value);
}
