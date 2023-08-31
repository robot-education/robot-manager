import * as React from "react";
import * as Blueprint from "@blueprintjs/core";

import { AppNavbar } from "./app-navbar";
import { getElementPath, post } from "./api";
import { ApiDialog, MenuState } from "./api-dialog";
import { useState } from "react";

export function AssemblyApp(): JSX.Element {
    const [menuState, setMenuState] = useState(MenuState.CLOSED);
    const executeAutoAssembly = async () => {
        setMenuState(MenuState.EXECUTING);
        await post("auto-assembly", getElementPath());
        setMenuState(MenuState.FINISHED);
    };

    const executeDialog = (
        <ApiDialog
            menuState={menuState}
            setMenuState={setMenuState}
            title="Auto assembly"
            loadingMessage="Executing auto assembly"
            successMessage="Successfully executed auto assembly"
        />
    );

    return (
        <>
            <AppNavbar />
            <Blueprint.Card>
                <Blueprint.H4>Execute auto assembly</Blueprint.H4>
                <p>
                    Execute the auto assembly script on parts in the current assembly.
                </p>
                {/* <Checkbox label='Resolve assembly mirror' /> */}
                <Blueprint.Button
                    text="Execute"
                    intent="primary"
                    type="submit"
                    rightIcon="arrow-right"
                    onClick={executeAutoAssembly}
                />
            </Blueprint.Card>
            {executeDialog}
        </>
    );
}
