import { ActionCard } from "../actions/action-card";
import { ActionDialog } from "../actions/action-dialog";
import { ActionError } from "../actions/action-error";
import { ActionForm } from "../actions/action-form";
import { ActionSpinner } from "../actions/action-spinner";

const actionInfo = {
    title: "Push version",
    description:
        "Create a version and push it to one or more target documents.",
    parentId: "/app/versions",
    route: "push-version"
};

export function PushVersionCard() {
    return <ActionCard actionInfo={actionInfo} />;
}

export function PushVersion() {
    return (
        <ActionDialog actionInfo={actionInfo}>
            <PushVersionForm />
            <ActionSpinner message="Pushing versions" />
            <ActionError />
        </ActionDialog>
    );
}

function PushVersionForm() {
    return <ActionForm />;
}
