import { NonIdealState, Spinner, Button } from "@blueprintjs/core";
import { ActionDialogBody } from "./action-dialog-body";
import { ActionState } from "./action-state";
import { closeMenu } from "./action-utils";

interface ActionSpinnerProps {
    message: string;
}

export function ActionSpinner(props: ActionSpinnerProps) {
    const abortButton = (
        <Button text="Abort" intent="danger" icon="cross" onClick={closeMenu} />
    );

    return (
        <ActionDialogBody requiredState={ActionState.EXECUTING}>
            <NonIdealState
                icon={<Spinner intent="primary" />}
                title={props.message}
                action={abortButton}
            />
        </ActionDialogBody>
    );
}
