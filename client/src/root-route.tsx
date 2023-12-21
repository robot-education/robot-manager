import { RootRoute } from "@tanstack/react-router";
import { Root } from "./root";

export const rootRoute = new RootRoute({
    component: () => <Root />
});
