import { ActionCard } from "@/actions/action-card";
import { ActionDialog } from "@/actions/action-dialog";
import { ActionError } from "@/actions/action-error";
import { ActionSpinner } from "@/actions/action-spinner";

const actionInfo = {
    title: "Update all references",
    description:
        "Update all external references in the document to the latest version.",
    parentId: "/app/versions",
    route: "update-all-references"
};

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
