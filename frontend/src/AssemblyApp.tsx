import * as React from "react";

import {
    Navbar,
    NavbarGroup,
    NavbarHeading,
    Button,
    Card,
    H5,
    // ProgressBar,
} from "@blueprintjs/core";

export function AssemblyApp(): JSX.Element {
    return (<>
        <Navbar>
            <NavbarGroup>
                <NavbarHeading>Robot manager</NavbarHeading>
            </NavbarGroup>
        </Navbar>
        {/* <ProgressBar intent="primary" value={0.2} /> */}
        <Card>
            <H5>Auto assembly</H5>
            <p>
                Execute the auto assembly script on parts in the current assembly.
            </p>
            {/* <Checkbox label="Resolve assembly mirror" /> */}
            <Button text="Execute" intent="primary" type="submit" rightIcon="arrow-right" />
        </Card>
    </>);
}