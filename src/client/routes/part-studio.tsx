import { useState, Dispatch } from "react";

import {
    Button,
    FormGroup,
    InputGroup,
    Intent,
    Tooltip,
} from "@blueprintjs/core";

import { ApiDialog } from "../common/api-dialog";
import { post } from "../api/api";
import { currentPathQuery, getCurrentPath } from "../api/path";

export function PartStudio(): JSX.Element {
    // const [autoAssemble, setAutoAssemble] = useState(true);
    const [assemblyName, setAssemblyName] = useState("Assembly");
    const [assemblyUrl, setAssemblyUrl] = useState<string | undefined>();

    const temp = 5;

    const executeGenerateAssembly = async (): Promise<boolean> => {
        const result = await post(
            "/generate-assembly",
            currentPathQuery(),
            {
                name: assemblyName
            });
        if (result == null) { return false; }
        const assemblyPath = getCurrentPath();
        assemblyPath.elementId = result.elementId;
        setAssemblyUrl(
            `https://cad.onshape.com/documents/${assemblyPath.documentId}/w/${assemblyPath.workspaceId}/e/${assemblyPath.elementId}`,
        );
        // if (autoAssemble) {
        // const result = await post("/auto-assembly", assemblyPath.elementObject());
        // if (result == null) { return false; }
        // }
        return true;
    };

    const openAssembly = (<Button
        text="Open assembly"
        intent="primary"
        icon="share"
        onClick={() => {
            // setMenuState(MenuState.CLOSED);
            window.open(assemblyUrl);
        }}
    />);

    const options = (<>
        <FormGroup
            label="Assembly name"
            labelFor="assembly-name"
            labelInfo="(required)"
        >
            <Tooltip content={"The name of the generated assembly"}>
                <InputGroup
                    id="assembly-name"
                    value={assemblyName}
                    intent={assemblyName === "" ? Intent.DANGER : undefined}
                    onChange={handleStringChange(setAssemblyName)}
                />
            </Tooltip>
        </FormGroup>
        {/* <FormGroup
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
        </FormGroup> */}
    </>);

    const generateAssemblyDialog = (<ApiDialog
        title="Generate assembly"
        description="Generate a new assembly from the current part studio."
        options={options}
        disabled={assemblyName === ""}
        execute={executeGenerateAssembly}
        loadingMessage="Generating assembly"
        successMessage="Successfully generated assembly"
        successDescription="Remember to fix a part in the assembly to lock it in place."
        successActions={openAssembly}
    />);

    return generateAssemblyDialog;
}

// /** Event handler that exposes the target element's value as a boolean. */
// function handleBooleanChange(handler: Dispatch<boolean>) {
//     return (event: React.FormEvent<HTMLElement>) =>
//         handler((event.target as HTMLInputElement).checked);
// }

/** Event handler that exposes the target element's value as a string. */
function handleStringChange(handler: Dispatch<string>) {
    return (event: React.FormEvent<HTMLElement>) =>
        handler((event.target as HTMLInputElement).value);
}
