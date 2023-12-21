import { Navigate } from "@tanstack/react-router";
import { useAppSelector } from "../store/hooks";
import { selectTabType } from "./app-slice";
import { appIndexRoute } from "../routes";

export function AppRedirect() {
    const tabType = useAppSelector(selectTabType);
    return (
        <Navigate
            from={appIndexRoute.id}
            to={`/app/${tabType}`}
            params={(params) => params}
        />
    );
}
