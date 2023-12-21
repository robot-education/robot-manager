import { Intent } from "@blueprintjs/core";
import { NonIdealStateOverride } from "../common/non-ideal-state-override";
import { ActionDialogBody } from "./action-dialog-body";
import { ActionState } from "./action-state";
import { CloseButton } from "./close-button";

export function ActionError() {
    return (
        <ActionDialogBody
            requiredState={ActionState.ERROR}
            actions={<CloseButton />}
        >
            <NonIdealStateOverride
                icon="cross"
                iconIntent={Intent.DANGER}
                title="Request failed unexpectedly"
                description="If the problem persists, contact Alex."
            />
        </ActionDialogBody>
    );
}
