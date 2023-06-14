import React, { useCallback, useState } from "react";

import {
    Button,
    Card,
    Checkbox,
    Dialog,
    DialogBody,
    DialogFooter,
    FormGroup,
    H5,
    Icon,
    InputGroup,
    NonIdealState,
    NonIdealStateIconSize,
    Spinner,
    Tooltip,
} from "@blueprintjs/core";

import { AppNavbar } from "./AppNavbar";
import { makeElementPath, post } from "./api";

enum State {
    NORMAL,
    EXECUTING,
    FINISHED
}

export function PartStudioApp(): JSX.Element {
    const [autoAssemble, setAutoAssemble] = useState(true);
    const [assemblyName, setAssemblyName] = useState("Assembly");
    const [state, setState] = useState(State.NORMAL);
    const [assemblyUrl, setAssemblyUrl] = useState<string | undefined>(undefined);

    const executeGenerateAssembly = useCallback(async () => {
        const execute = async () => {
            const elementPath = makeElementPath();
            const result = await post("generate-assembly", { ...elementPath, name: assemblyName });
            const assemblyPath = { documentId: elementPath.documentId, workspaceId: elementPath.workspaceId, elementId: result.elementId };
            setAssemblyUrl(`https://cad.onshape.com/documents/${assemblyPath.documentId}/w/${assemblyPath.workspaceId}/e/${assemblyPath.elementId}`);
            if (autoAssemble) {
                await post("auto-assembly", assemblyPath);
            }
        }
        setState(State.EXECUTING);
        await execute();
        setState(State.FINISHED);
    }, [autoAssemble, assemblyName]);

    const renderExecuteDialog = (
        <Dialog isOpen={state === State.FINISHED || state === State.EXECUTING}
            canEscapeKeyClose={state === State.FINISHED}
            canOutsideClickClose={state === State.FINISHED}
            isCloseButtonShown={state === State.FINISHED}
            onClose={() => setState(State.NORMAL)}
            title="Generate assembly"
        >
            <DialogBody useOverflowScrollContainer={false}>
                {state === State.EXECUTING ? (<NonIdealState
                    icon={<Spinner intent="primary" />}
                    title="Generating assembly"
                    action={<Button text="Abort" intent="danger" icon="cross" onClick={() => setState(State.NORMAL)} />}
                />) : (
                    <NonIdealState
                        icon={<Icon icon="tick" intent="success" size={NonIdealStateIconSize.STANDARD} />}
                        title="Assembly generated"
                        description={"Remember to fix a part in the assembly to lock it in place."}
                    />
                )}
            </DialogBody>
            <DialogFooter
                minimal={true}
                actions={state === State.FINISHED ? (<>
                    <Button
                        text="Open assembly"
                        intent="primary"
                        icon="share"
                        onClick={() => {
                            window.open(assemblyUrl);
                            setState(State.NORMAL);
                        }}
                    />
                    <Button
                        text="Close"
                        intent="success"
                        icon="tick"
                        onClick={() => setState(State.NORMAL)}
                    />
                </>) : null}
            />
        </Dialog >);

    return (<>
        <AppNavbar />
        <Card>
            <H5>Generate assembly</H5>
            <p>
                Generate an assembly from the current part studio.
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
                <Tooltip content={"Whether to execute auto assembly on the generated assembly"}>
                    <Checkbox id="auto-assemble" checked={autoAssemble} onClick={handleBooleanChange(setAutoAssemble)} />
                </Tooltip>
            </FormGroup>
            <Button text="Execute" intent="primary" type="submit" rightIcon="arrow-right" onClick={executeGenerateAssembly} />
        </Card >
        {renderExecuteDialog}
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