import { Button, Card, H4, Intent } from "@blueprintjs/core";
import { ActionInfo } from "./action-context";
import { useNavigate } from "@tanstack/react-router";

interface ActionCardProps {
    actionInfo: ActionInfo;
}

/**
 * Represents a card with an operation which can be executed.
 */
export function ActionCard(props: ActionCardProps): JSX.Element {
    const { actionInfo } = props;
    const navigate = useNavigate({ from: actionInfo.parentId });
    return (
        <Card>
            <H4>{actionInfo.title}</H4>
            <p>{actionInfo.description}</p>
            <Button
                text="Configure"
                rightIcon="arrow-right"
                intent={Intent.PRIMARY}
                onClick={() => navigate({ to: actionInfo.route })}
            />
        </Card>
    );
}
