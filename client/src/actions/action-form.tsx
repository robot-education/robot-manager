import { Button } from "@blueprintjs/core";
import { ActionState } from "./action-state";
import { ActionDialogBody } from "./action-dialog-body";
import { ReactNode } from "react";

interface ActionFormProps {
    disabled?: boolean;
    options?: ReactNode;
}

export function ActionForm(props: ActionFormProps) {
    const { disabled, options } = props;

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
        // <fetcher.Form method="post">
        <ActionDialogBody
            requiredState={ActionState.CONFIGURING}
            actions={executeButton}
        >
            {options}
        </ActionDialogBody>
        // </fetcher.Form>
    );
}
