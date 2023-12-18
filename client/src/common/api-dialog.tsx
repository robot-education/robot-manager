import { useState } from "react";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    Intent,
    NonIdealState,
    Spinner
} from "@blueprintjs/core";

import { NonIdealStateOverride } from "./non-ideal-state-override";

enum MenuState {
    CLOSED,
    EXECUTING,
    SUCCESS,
    ERROR
}

function isDone(menuState: MenuState): boolean {
    return menuState === MenuState.ERROR || menuState === MenuState.SUCCESS;
}

interface ActionDialogProps {
    title: string;
    loadingMessage: string;
    successMessage: string;
    successDescription?: string;
    successActions?: JSX.Element;
}

/**
 * A dialog component which displays an API call.
 */
export function ApiDialog(props: ActionDialogProps): JSX.Element {
    const [menuState, setMenuState] = useState(MenuState.CLOSED);
    const closeMenu = () => {
        // TODO: Remove CLOSED, navigate up the tree again or something
        setMenuState(MenuState.CLOSED);
    };

    // const execute = async () => {
    //     setMenuState(MenuState.EXECUTING);
    //     const success = await props.execute();
    //     setMenuState(success ? MenuState.SUCCESS : MenuState.ERROR);
    // };

    const body = (
        <DialogBody useOverflowScrollContainer={false}>
            {menuState === MenuState.EXECUTING && (
                <NonIdealState
                    icon={<Spinner intent="primary" />}
                    title={props.loadingMessage}
                    action={
                        <Button
                            text="Abort"
                            intent="danger"
                            icon="cross"
                            onClick={closeMenu}
                        />
                    }
                />
            )}
            {menuState === MenuState.ERROR && (
                <NonIdealStateOverride
                    icon="cross"
                    iconIntent={Intent.DANGER}
                    title={"Request failed unexpectedly"}
                    description={"If the problem persists, contact Alex."}
                />
            )}
            {menuState === MenuState.SUCCESS && (
                <NonIdealStateOverride
                    icon="tick"
                    iconIntent={Intent.SUCCESS}
                    title={props.successMessage}
                    description={props.successDescription}
                />
            )}
        </DialogBody>
    );

    const footer = (
        <DialogFooter
            minimal={true}
            actions={
                isDone(menuState) && (
                    <>
                        {menuState === MenuState.SUCCESS &&
                            props.successActions}
                        <Button
                            text="Close"
                            intent={
                                menuState === MenuState.SUCCESS
                                    ? Intent.SUCCESS
                                    : Intent.PRIMARY
                            }
                            icon="tick"
                            onClick={closeMenu}
                        />
                    </>
                )
            }
        />
    );

    return (
        <Dialog
            isOpen
            canEscapeKeyClose={isDone(menuState)}
            canOutsideClickClose={isDone(menuState)}
            isCloseButtonShown={isDone(menuState)}
            onClose={closeMenu}
            title={props.title}
        >
            {body}
            {footer}
        </Dialog>
    );
}
