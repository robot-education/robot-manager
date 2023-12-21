import { DialogBody, DialogFooter } from "@blueprintjs/core";
import { ReactNode, useContext } from "react";
import { actionContext } from "./action-context";
import { ActionState } from "./action-state";
import { useMutationState } from "@tanstack/react-query";

interface ActionDialogBodyProps {
    requiredState: ActionState;
    children: ReactNode;
    actions?: ReactNode;
}

export function ActionDialogBody(props: ActionDialogBodyProps) {
    const { requiredState } = props;
    const actionInfo = useContext(actionContext);
    const statuses = useMutationState({
        filters: { mutationKey: [actionInfo.route] },
        select: (mutation) => mutation.state.status
    });

    if (statuses.length == 0) {
        return undefined;
    }

    const status = statuses[0];

    return (
        status === requiredState && (
            <>
                <DialogBody useOverflowScrollContainer={false}>
                    {status === ActionState.CONFIGURING && (
                        <p>{actionInfo.description}</p>
                    )}
                    {props.children}
                </DialogBody>
                <DialogFooter minimal actions={props.actions} />
            </>
        )
    );
}
