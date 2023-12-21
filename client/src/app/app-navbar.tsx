import {
    Alignment,
    Button,
    Intent,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading
} from "@blueprintjs/core";
import { selectTabType } from "./app-slice";
import { useAppSelector } from "../store/hooks";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { appRoute } from "../routes";

export function AppNavbar(): JSX.Element {
    const tabType = useAppSelector(selectTabType);
    const navigate = useNavigate({ from: appRoute.id });
    const matchRoute = useMatchRoute();
    const isHome = Boolean(matchRoute({ to: `/app/${tabType}/*` }));

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
                    onClick={() => navigate({ to: tabType })}
                />
                <Button
                    icon="git-new-branch"
                    text="Versions"
                    minimal
                    active={!isHome}
                    intent={!isHome ? Intent.PRIMARY : Intent.NONE}
                    onClick={() => navigate({ to: "versions" })}
                />
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
                <Button icon="cog" minimal />
            </NavbarGroup>
        </Navbar>
    );
}
