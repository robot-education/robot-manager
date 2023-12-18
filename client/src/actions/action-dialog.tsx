import { Dialog } from "@blueprintjs/core";
import { useFetcher, useNavigate } from "react-router-dom";
import { getActionState, isFinished, isLoading } from "./action-state";
import React, { useContext } from "react";
import { actionContext } from "./action-context";

interface ActionDialogProps {
    children: React.ReactNode;
}

export function ActionDialog(props: ActionDialogProps) {
    const navigate = useNavigate();
    const actionInfo = useContext(actionContext);
    const fetcher = useFetcher(actionInfo);

    const actionState = getActionState(fetcher);
    const finished = isFinished(actionState);
    const loading = isLoading(actionState);

    return (
        <Dialog
            isOpen
            title={actionInfo.title}
            canOutsideClickClose={finished}
            canEscapeKeyClose={!loading}
            isCloseButtonShown={!loading}
            onClose={() => navigate("..")}
        >
            {props.children}
        </Dialog>
    );
}
