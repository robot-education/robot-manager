import { Dialog } from "@blueprintjs/core";
import { ActionContextProvider, ActionInfo } from "./action-context";
import { ReactNode } from "react";
import { closeMenu } from "./action-utils";
import { useMutationState } from "@tanstack/react-query";
import { ActionState } from "./action-state";

interface ActionDialogProps {
    children: ReactNode;
    actionInfo: ActionInfo;
}

export function ActionDialog(props: ActionDialogProps) {
    const { actionInfo } = props;
    const statuses = useMutationState({
        filters: { mutationKey: [actionInfo.route] },
        select: (mutation) => mutation.state.status
    });

    if (statuses.length == 0) {
        return undefined;
    }
    const status = statuses[0];
    return (
        <ActionContextProvider value={actionInfo}>
            <Dialog
                isOpen
                title={actionInfo.title}
                canOutsideClickClose={
                    status == ActionState.SUCCESS || status == ActionState.ERROR
                }
                canEscapeKeyClose={status != ActionState.EXECUTING}
                isCloseButtonShown={status != ActionState.EXECUTING}
                onClose={closeMenu}
            >
                {props.children}
            </Dialog>
        </ActionContextProvider>
    );
}
