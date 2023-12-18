import { Outlet } from "react-router-dom";
import { PushVersionCard } from "./push-version";
import { UpdateReferencesCard } from "./update-references";

export function Versions(): JSX.Element {
    return (
        <>
            <PushVersionCard />
            <UpdateReferencesCard />
            <Outlet />
        </>
    );
}
