import { Button } from "@blueprintjs/core";
import { useFetcher } from "react-router-dom";
import { actionContext } from "./action-context";
import { useContext } from "react";
import { ActionState } from "./action-state";
import { ActionDialogBody } from "./action-dialog-body";

interface ActionFormProps {
    disabled?: boolean;
    options?: JSX.Element;
}

export function ActionForm(props: ActionFormProps) {
    const { disabled, options } = props;
    const actionInfo = useContext(actionContext);
    const fetcher = useFetcher(actionInfo);

    const executeButton = (
        <Button
            text="Execute"
            intent="primary"
            type="submit"
            rightIcon="arrow-right"
            disabled={disabled ?? false}
        />
    );

    return (
        <fetcher.Form method="post">
            <ActionDialogBody
                requiredState={ActionState.CONFIGURING}
                actions={executeButton}
            >
                {options}
            </ActionDialogBody>
        </fetcher.Form>
    );
}
