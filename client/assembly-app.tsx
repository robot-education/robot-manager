import { useState } from "react";
import { Card, H4, Button } from "@blueprintjs/core";

import { AppNavbar } from "./app-navbar";
import { getElementPath, post } from "./api";
import { ApiDialog, MenuState } from "./api-dialog";

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
            <Card>
                <H4>Execute auto assembly</H4>
                <p>
                    Execute the auto assembly script on parts in the current
                    assembly.
                </p>
                {/* <Checkbox label='Resolve assembly mirror' /> */}
                <Button
                    text="Execute"
                    intent="primary"
                    type="submit"
                    rightIcon="arrow-right"
                    onClick={executeAutoAssembly}
                />
            </Card>
            {executeDialog}
        </>
    );
}
