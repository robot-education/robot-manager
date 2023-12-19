import { Button, Intent } from "@blueprintjs/core";
import { ActionState, getActionState } from "./action-state";
import { useFetcher, useNavigate } from "react-router-dom";
import { getCloseMenuHandler as closeMenuHandler } from "./action-utils";

export function CloseButton() {
    const navigate = useNavigate();
    const fetcher = useFetcher();
    const actionState = getActionState(fetcher);
    const isSuccess = actionState === ActionState.SUCCESS;
    return (
        <Button
            text="Close"
            intent={isSuccess ? Intent.NONE : Intent.PRIMARY}
            icon="tick"
            onClick={closeMenuHandler(fetcher, navigate)}
        />
    );
}
