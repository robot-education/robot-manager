import { Button, Card, H4, Intent } from "@blueprintjs/core";
import { Outlet, useNavigate } from "react-router-dom";
import { ActionContextProvider, makeActionInfo } from "./action-context";

interface ActionCardProps {
    title: string;
    description: string;
}

/**
 * Represents a card with an operation which can be executed.
 */
export function ActionCard(props: ActionCardProps): JSX.Element {
    const navigate = useNavigate();
    const actionInfo = makeActionInfo(props.title, props.description);
    return (
        <ActionContextProvider value={actionInfo}>
            <Card>
                <H4>{props.title}</H4>
                <p>{props.description}</p>
                <Button
                    text="Configure"
                    rightIcon="arrow-right"
                    intent={Intent.PRIMARY}
                    onClick={() => navigate(actionInfo.key)}
                />
            </Card>
            <Outlet />
        </ActionContextProvider>
    );
}
