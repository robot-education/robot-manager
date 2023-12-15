import { Card, H4 } from "@blueprintjs/core";

interface ActionCardProps {
    title: string;
    description: string;
    options?: JSX.Element;
    executeButton: JSX.Element;
}

/**
 * Represents a card with an operation which can be executed.
 */
export function ActionCard(props: ActionCardProps): JSX.Element {
    return (
        <Card>
            <H4>{props.title}</H4>
            <p>{props.description}</p>
            {props.options}
            {props.executeButton}
        </Card>
    );
}
