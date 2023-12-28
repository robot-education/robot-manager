"use client";
import { Button, Card, H4, Intent } from "@blueprintjs/core";
import { ActionInfo } from "./action-context";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ActionCardProps {
    actionInfo: ActionInfo;
}

/**
 * Represents a card with an operation which can be executed.
 */
export function ActionCard(props: ActionCardProps): ReactNode {
    const { actionInfo } = props;
    const router = useRouter();
    const pathname = usePathname();

    return (
        <Card>
            <H4>{actionInfo.title}</H4>
            <p>{actionInfo.description}</p>
            <Button
                text="Configure"
                rightIcon="arrow-right"
                intent={Intent.PRIMARY}
                onClick={() => router.push(pathname + "/" + actionInfo.route)}
            />
        </Card>
    );
}
