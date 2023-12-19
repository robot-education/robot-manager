import { Dialog } from "@blueprintjs/core";
import { useFetcher, useNavigate } from "react-router-dom";
import { ActionState, getActionState, isFinished } from "./action-state";
import { ActionContextProvider, ActionInfo } from "./action-context";
import { ReactNode } from "react";
import { getCloseMenuHandler } from "./action-utils";

interface ActionDialogProps {
    children: ReactNode;
    actionInfo: ActionInfo;
}

export function ActionDialog(props: ActionDialogProps) {
    const { actionInfo } = props;
    const navigate = useNavigate();
    const fetcher = useFetcher(actionInfo);

    const actionState = getActionState(fetcher);
    const finished = isFinished(actionState);
    const executing = actionState === ActionState.EXECUTING;

    return (
        <ActionContextProvider value={actionInfo}>
            <Dialog
                isOpen
                title={actionInfo.title}
                canOutsideClickClose={finished}
                canEscapeKeyClose={!executing}
                isCloseButtonShown={!executing}
                onClose={getCloseMenuHandler(fetcher, navigate)}
            >
                {props.children}
            </Dialog>
        </ActionContextProvider>
    );
}
