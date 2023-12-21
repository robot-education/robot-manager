import { Button, Intent } from "@blueprintjs/core";
import { closeMenu } from "./action-utils";

export function CloseButton() {
    return (
        <Button
            text="Close"
            intent={Intent.PRIMARY}
            icon="tick"
            onClick={closeMenu}
        />
    );
}
