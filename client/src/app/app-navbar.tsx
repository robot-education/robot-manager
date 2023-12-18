import {
    Alignment,
    Button,
    Intent,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading
} from "@blueprintjs/core";
import { useMatch, useNavigate } from "react-router-dom";
import { selectTabType } from "./app-slice";
import { useAppSelector } from "../store/hooks";

export function AppNavbar(): JSX.Element {
    const navigate = useNavigate();
    const tabType = useAppSelector(selectTabType);
    const isHome = Boolean(useMatch({ path: `/app/${tabType}`, end: false }));
    return (
        <Navbar>
            <NavbarGroup>
                <NavbarHeading>Robot manager</NavbarHeading>
                <NavbarDivider />
                <Button
                    icon="home"
                    text="Home"
                    minimal
                    active={isHome}
                    intent={isHome ? Intent.PRIMARY : Intent.NONE}
                    onClick={() => navigate(tabType)}
                />
                <Button
                    icon="git-new-branch"
                    text="Versions"
                    minimal
                    active={!isHome}
                    intent={!isHome ? Intent.PRIMARY : Intent.NONE}
                    onClick={() => navigate("versions")}
                />
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
                <Button icon="cog" minimal />
            </NavbarGroup>
        </Navbar>
    );
}
