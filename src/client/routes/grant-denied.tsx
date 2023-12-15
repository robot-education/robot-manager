import { useEffect } from "react";
import { Button, NonIdealState } from "@blueprintjs/core";

const URL = "https://cad.onshape.com/user/applications";

export function GrantDenied(): JSX.Element {
    useEffect(() => {
        document.title = "Robot Manager";
    }, []);

    const applicationAccessButton = (
        <Button
            text="Open application access page"
            intent="primary"
            icon="share"
            onClick={() => window.open(URL)}
        />
    );

    return (
        <NonIdealState
            icon="cross"
            title="Grant denied"
            description="Robot manager was denied access to your documents."
            action={applicationAccessButton}
        />
    );
}
