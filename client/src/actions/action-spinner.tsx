import { NonIdealState, Spinner, Button } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import { ActionDialogBody } from "./action-dialog-body";
import { ActionState } from "./action-state";

interface ActionSpinnerProps {
    message: string;
}

export function ActionSpinner(props: ActionSpinnerProps) {
    const navigate = useNavigate();

    return (
        <ActionDialogBody requiredState={ActionState.LOADING}>
            <NonIdealState
                icon={<Spinner intent="primary" />}
                title={props.message}
                action={
                    <Button
                        text="Abort"
                        intent="danger"
                        icon="cross"
                        onClick={() => navigate("..")}
                    />
                }
            />
        </ActionDialogBody>
    );
}
