import { useState } from "react";
import {
    FormGroup,
    Tooltip,
    InputGroup,
    Intent,
    Button
} from "@blueprintjs/core";
import { useMutation } from "@tanstack/react-query";
import { handleStringChange } from "../handlers";
import { ActionCard } from "../actions/action-card";
import { ActionForm } from "../actions/action-form";
import { ActionDialog } from "../actions/action-dialog";
import { ActionSpinner } from "../actions/action-spinner";
import { ActionError } from "../actions/action-error";
import { ActionSuccess } from "../actions/action-success";
import { ActionInfo } from "../actions/action-context";
import { selectCurrentPathQuery } from "../app/app-slice";
import { store } from "../store/store";
import { post } from "../api/api";

interface GenerateAssemblyData {
    assemblyName: string;
}

async function generateAssemblyMutation(args: GenerateAssemblyData) {
    const currentPath = selectCurrentPathQuery(store.getState());

    const result = await post("/generate-assembly", currentPath, {
        name: args.assemblyName
    }).catch(() => null);
    if (!result) {
        throw new Error("Request failed.");
    }

    const assemblyPath = Object.assign({}, currentPath);
    assemblyPath.elementId = result.elementId;
    const assemblyUrl = `https://cad.onshape.com/documents/${assemblyPath.documentId}/w/${assemblyPath.workspaceId}/e/${assemblyPath.elementId}`;
    // if (data.autoAssemble) {
    // const result = await post("/auto-assembly", assemblyPath.elementObject());
    // if (result == null) { return false; }
    // }
    return { assemblyUrl };
}

const actionInfo: ActionInfo = {
    title: "Generate assembly",
    description: "Generate a new assembly from the current part studio.",
    parentId: "/app/part-studio",
    route: "generate-assembly"
};

export function GenerateAssemblyCard() {
    return <ActionCard actionInfo={actionInfo} />;
}

export function GenerateAssembly() {
    const mutation = useMutation({
        mutationKey: [actionInfo.route],
        mutationFn: generateAssemblyMutation
    });
    const openButton = mutation.isSuccess && (
        <Button
            text="Open assembly"
            intent="primary"
            icon="share"
            onClick={() => {
                window.open(mutation.data.assemblyUrl);
            }}
        />
    );

    return (
        <ActionDialog actionInfo={actionInfo}>
            <GenerateAssemblyForm />
            <ActionSpinner message="Generating assembly" />
            <ActionSuccess
                message="Successfully generated assembly."
                description="Remember to fix a part in the assembly to lock it in place."
                actions={openButton}
            />
            <ActionError />
        </ActionDialog>
    );
}

function GenerateAssemblyForm() {
    const [assemblyName, setAssemblyName] = useState("Assembly");
    // const [autoAssemble, setAutoAssemble] = useState(true);
    const disabled = assemblyName === "";

    const options = (
        <>
            <FormGroup
                label="Assembly name"
                labelFor="assemblyName"
                labelInfo="(required)"
            >
                <Tooltip content={"The name of the generated assembly"}>
                    <InputGroup
                        name="assemblyName"
                        value={assemblyName}
                        intent={disabled ? Intent.DANGER : undefined}
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
        </>
    );
    return <ActionForm disabled={disabled} options={options} />;
}
