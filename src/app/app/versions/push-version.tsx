import { ActionCard } from "@/actions/action-card";
import { ActionInfo } from "@/actions/action-context";
import { ActionDialog } from "@/actions/action-dialog";
import { ActionError } from "@/actions/action-error";
import { ActionForm } from "@/actions/action-form";
import { ActionSpinner } from "@/actions/action-spinner";

const actionInfo: ActionInfo = {
    title: "Push version",
    description:
        "Create a version and push it to one or more target documents.",
    route: "push-version"
};

export function PushVersionCard() {
    return <ActionCard actionInfo={actionInfo} />;
}

export function PushVersion() {
    return (
        // <ActionDialog actionInfo={actionInfo}>
        //     <PushVersionForm />
        //     <ActionSpinner message="Pushing versions" />
        //     <ActionError />
        // </ActionDialog>
    );
}

function PushVersionForm() {
    // return <ActionForm />;
}
