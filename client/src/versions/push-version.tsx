import { ActionCard } from "../actions/action-card";
import { ActionForm } from "../actions/action-form";

const titleAndDescription = {
    title: "Push version",
    description: "Create a version and push it to one or more target documents."
};

export function PushVersionCard() {
    return <ActionCard {...titleAndDescription} key={"push-version"} />;
}

export function PushVersion() {
    const options = <></>;
    return <ActionForm {...titleAndDescription} options={options} />;
}
