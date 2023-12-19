import { Button, Card, H4, Intent } from "@blueprintjs/core";
import {  useNavigate } from "react-router-dom";
import { ActionInfo } from "./action-context";

interface ActionCardProps {
    actionInfo: ActionInfo;
}

/**
 * Represents a card with an operation which can be executed.
 */
export function ActionCard(props: ActionCardProps): JSX.Element {
    const { actionInfo } = props;
    const navigate = useNavigate();
    return (
        <Card>
            <H4>{actionInfo.title}</H4>
            <p>{actionInfo.description}</p>
            <Button
                text="Configure"
                rightIcon="arrow-right"
                intent={Intent.PRIMARY}
                onClick={() => navigate(actionInfo.key)}
            />
        </Card>
    );
}
