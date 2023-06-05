import React from "react";
import {
    Navbar,
    NavbarGroup,
    NavbarHeading
} from "@blueprintjs/core";

export function AppNavbar(): JSX.Element {
    return (
        <Navbar>
            <NavbarGroup>
                <NavbarHeading>Robot manager</NavbarHeading>
            </NavbarGroup>
        </Navbar>
    );
}