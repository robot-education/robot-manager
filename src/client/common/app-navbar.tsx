import { Button, Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";

interface AppNavbarProps {}

export function AppNavbar(props: AppNavbarProps): JSX.Element {
    return (
        <Navbar>
            <NavbarGroup>
                <NavbarHeading>Robot manager</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup>
                <Button icon="home" text="Home" minimal={true} />
                <Button icon="git-new-branch" text="Versions" minimal={true} />
            </NavbarGroup>
        </Navbar>
    );
}
