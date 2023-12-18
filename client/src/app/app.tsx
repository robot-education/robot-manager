import { Navigate, Outlet, useLocation, useMatch } from "react-router-dom";

import { AppNavbar } from "./app-navbar";
import { selectTabType } from "./app-slice";
import { useAppSelector } from "../store/hooks";

export function App() {
    console.log(useLocation().pathname);

    const isAppPath = Boolean(useMatch({ path: "/app", end: true }));
    const tabType = useAppSelector(selectTabType);
    return isAppPath ? (
        <Navigate to={tabType} />
    ) : (
        <>
            <AppNavbar />
            <Outlet />
        </>
    );
}
