export enum ActionState {
    CONFIGURING,
    LOADING,
    ERROR,
    SUCCESS
}

export function getActionState(fetcher: any): ActionState {
    if (fetcher.state == "idle") {
        if (!fetcher.formData) {
            return ActionState.CONFIGURING;
        }
        return fetcher.data.error ? ActionState.ERROR : ActionState.SUCCESS;
    }
    return ActionState.LOADING;
}

export function isFinished(actionState: ActionState) {
    return (
        actionState == ActionState.ERROR || actionState == ActionState.SUCCESS
    );
}

export function isLoading(actionState: ActionState) {
    return actionState == ActionState.LOADING;
}
