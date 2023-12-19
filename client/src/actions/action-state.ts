import { FetcherWithComponents } from "react-router-dom";

export enum ActionState {
    CONFIGURING,
    EXECUTING,
    ERROR,
    SUCCESS
}

export function getActionState(
    fetcher: FetcherWithComponents<any>
): ActionState {
    if (fetcher.state == "idle") {
        if (!fetcher.data) {
            return ActionState.CONFIGURING;
        }
        return fetcher.data.error ? ActionState.ERROR : ActionState.SUCCESS;
    }
    return ActionState.EXECUTING;
}

export function isFinished(actionState: ActionState) {
    return (
        actionState == ActionState.ERROR || actionState == ActionState.SUCCESS
    );
}
