import { DialogBody, DialogFooter } from "@blueprintjs/core";
import React, { useContext } from "react";
import { useFetcher } from "react-router-dom";
import { actionContext } from "./action-context";
import { getActionState, ActionState } from "./action-state";

interface ActionDialogBodyProps {
    requiredState: ActionState;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export function ActionDialogBody(props: ActionDialogBodyProps) {
    const actionInfo = useContext(actionContext);
    const fetcher = useFetcher(actionInfo);
    const actionState = getActionState(fetcher);
    return (
        actionState == props.requiredState && (
            <>
                <DialogBody useOverflowScrollContainer={false}>
                    {actionState == ActionState.CONFIGURING && (
                        <p>{actionInfo.description}</p>
                    )}
                    {props.children}
                </DialogBody>
                <DialogFooter minimal>{props.actions}</DialogFooter>
            </>
        )
    );
}
