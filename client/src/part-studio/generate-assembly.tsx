import { useState } from "react";
import {
    FormGroup,
    Tooltip,
    InputGroup,
    Intent,
    Button
} from "@blueprintjs/core";
import { handleStringChange } from "../handlers";
import { ActionCard } from "../actions/action-card";
import { ActionForm } from "../actions/action-form";
import { useFetcher, useNavigate } from "react-router-dom";
import { ActionDialog } from "../actions/action-dialog";
import { ActionSpinner } from "../actions/action-spinner";
import { makeActionInfo } from "../actions/action-context";
import { ActionError } from "../actions/action-error";
import { ActionSuccess } from "../actions/action-success";
import { closeMenu } from "../actions/action-utils";

const actionInfo = makeActionInfo(
    "Generate assembly",
    "Generate a new assembly from the current part studio."
);

export function GenerateAssemblyCard() {
    return <ActionCard actionInfo={actionInfo} />;
}

export function GenerateAssembly() {
    const navigate = useNavigate();
    const fetcher = useFetcher(actionInfo);

    console.log("Fetcher state: " + fetcher.state);
    console.log("Fetcher data: " + fetcher.data);

    const openButton = fetcher.data && !fetcher.data.error && (
        <Button
            text="Open assembly"
            intent="primary"
            icon="share"
            onClick={() => {
                window.open(fetcher.data.assemblyUrl);
                closeMenu(fetcher, navigate);
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
