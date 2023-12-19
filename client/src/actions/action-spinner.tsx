import { NonIdealState, Spinner, Button } from "@blueprintjs/core";
import { useFetcher, useNavigate } from "react-router-dom";
import { ActionDialogBody } from "./action-dialog-body";
import { ActionState } from "./action-state";
import { getCloseMenuHandler } from "./action-utils";
import { actionContext } from "./action-context";
import { useContext } from "react";

interface ActionSpinnerProps {
    message: string;
}

export function ActionSpinner(props: ActionSpinnerProps) {
    const navigate = useNavigate();
    const actionInfo = useContext(actionContext);
    const fetcher = useFetcher(actionInfo);

    const abortButton = (
        <Button
            text="Abort"
            intent="danger"
            icon="cross"
            onClick={getCloseMenuHandler(fetcher, navigate)}
        />
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
