import { Outlet } from "@tanstack/react-router";
import { GenerateAssemblyCard } from "./generate-assembly";

export function PartStudio(): JSX.Element {
    return (
        <>
            <GenerateAssemblyCard />
            <Outlet />
        </>
    );
}
