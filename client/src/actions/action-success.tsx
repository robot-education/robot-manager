import { NonIdealStateOverride } from "../common/non-ideal-state-override";
import { ActionDialogBody } from "./action-dialog-body";

interface ActionSuccessProps {
    message: string;
    description: string;
}
export function ActionSuccess(props: ActionSuccessProps) {
    return (
        <ActionDialogBody>
            <NonIdealStateOverride>

            </NonIdealStateOverride>
        </ActionDialogBody>
    );
}
