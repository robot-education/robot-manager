import { useCurrentMutation } from "./action-utils";

export enum ActionState {
    CONFIGURING = "idle",
    EXECUTING = "pending",
    ERROR = "error",
    SUCCESS = "success"
}

export function useCurrentActionState(): ActionState {
    const mutation = useCurrentMutation();
    return mutation.status as ActionState;
    // const statuses = useMutationState({
    //     filters: { mutationKey: [actionInfo.route] },
    //     select: (mutation) => mutation.state.status as ActionState
    // });
    // console.log(statuses);
    // if (statuses.length == 0) {
    //     return ActionState.CONFIGURING;
    // }
    // return statuses[0];
}
