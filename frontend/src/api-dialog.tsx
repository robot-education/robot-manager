import React from "react";

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  NonIdealState,
  Spinner,
} from "@blueprintjs/core";

import { NonIdealStateOverride } from "./components/non-ideal-state-override";

export enum MenuState {
  CLOSED,
  EXECUTING,
  FINISHED,
}

interface ApiDialogProps {
  menuState: MenuState;
  setMenuState: (menuState: MenuState) => void;
  title: string;
  loadingMessage: string;
  successMessage: string;
  successDescription?: string;
  additionalActions?: JSX.Element;
}

/**
 * A dialog component which displays content during and and after an API call is made.
 */
export function ApiDialog(props: ApiDialogProps): JSX.Element {
  const { menuState, setMenuState } = props;
  const closeMenu = () => { setMenuState(MenuState.CLOSED); };

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
      {menuState === MenuState.FINISHED && (
        <NonIdealStateOverride
          icon="tick"
          iconIntent="success"
          title={props.successMessage}
          description={props.successDescription}
        />
      )}
    </DialogBody>
  );

  const footer = (
    <DialogFooter
      minimal={true}
      actions={menuState === MenuState.FINISHED && (
        <>
          {props.additionalActions}
          <Button
            text="Close"
            intent="success"
            icon="tick"
            onClick={closeMenu}
          />
        </>
      )}
    />
  );

  return (
    <Dialog
      isOpen={
        menuState === MenuState.FINISHED || menuState === MenuState.EXECUTING
      }
      canEscapeKeyClose={menuState === MenuState.FINISHED}
      canOutsideClickClose={menuState === MenuState.FINISHED}
      isCloseButtonShown={menuState === MenuState.FINISHED}
      onClose={closeMenu}
      title={props.title}
    >
      {body}
      {footer}
    </Dialog>
  );
}
