import { Button, Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";

interface AppNavbarProps {

}

export function AppNavbar(): JSX.Element {
    return (
        <Navbar>
            <NavbarGroup>
                <NavbarHeading>Robot manager</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup>
                <Button icon="home" text="Home" />
                <Button icon="git-new-branch" text="Versions" />
            </NavbarGroup>
        </Navbar>
    );
}
