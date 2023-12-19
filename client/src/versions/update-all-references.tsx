import { ActionCard } from "../actions/action-card";
import { makeActionInfo } from "../actions/action-context";
import { ActionDialog } from "../actions/action-dialog";
import { ActionError } from "../actions/action-error";
import { ActionSpinner } from "../actions/action-spinner";

const actionInfo = makeActionInfo(
    "Update all references",
    "Update all external references in the document to the latest version."
);

export function UpdateAllReferencesCard() {
    return <ActionCard actionInfo={actionInfo} />;
}

export function UpdateAllReferences() {
    return (
        <ActionDialog actionInfo={actionInfo}>
            <ActionSpinner message="Updating references" />
            <ActionError />
        </ActionDialog>
    );
    // return <ActionForm {...titleAndDescription} />;
}
