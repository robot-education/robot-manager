import { ActionCard } from "../actions/action-card";
import { ActionForm } from "../actions/action-form";

const titleAndDescription = {
    title: "Update references",
    description:
        "Update all external references in the document to the latest version."
};

export function UpdateReferencesCard() {
    return <ActionCard {...titleAndDescription} key={"update-references"} />;
}

export function UpdateReferences() {
    return <ActionForm {...titleAndDescription} />;
}
