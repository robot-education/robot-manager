import { Route } from "@tanstack/react-router";
import { UpdateAllReferences } from "./versions/update-all-references";
import { Versions } from "./versions/versions";
import { GrantDenied } from "./grant-denied";
import { PartStudio } from "./part-studio/part-studio";
import { GenerateAssembly } from "./part-studio/generate-assembly";
import { App } from "./app/app";
import { Assembly } from "./assembly/assembly";
import { AppRedirect } from "./app/app-redirect";
import { rootRoute } from "./root-route";

export const grantDeniedRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/grant-denied",
    component: () => <GrantDenied />
});

export const appRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/app",
    component: () => <App />
});

export const appIndexRoute = new Route({
    getParentRoute: () => appRoute,
    path: "/",
    component: () => <AppRedirect />
});

export const partStudioRoute = new Route({
    getParentRoute: () => appRoute,
    path: "/part-studio",
    component: () => <PartStudio />
});

export const generateAssemblyRoute = new Route({
    getParentRoute: () => partStudioRoute,
    path: "/generate-assembly",
    component: () => <GenerateAssembly />
});

export const assemblyRoute = new Route({
    getParentRoute: () => appRoute,
    path: "/assembly",
    component: () => <Assembly />
});

export const versionsRoute = new Route({
    getParentRoute: () => appRoute,
    path: "/versions",
    component: () => <Versions />
});

export const updateAllReferencesRoute = new Route({
    getParentRoute: () => versionsRoute,
    path: "/update-all-references",
    component: () => <UpdateAllReferences />
});

export const routeTree = rootRoute.addChildren([
    grantDeniedRoute,
    appRoute.addChildren([
        appIndexRoute,
        assemblyRoute,
        partStudioRoute.addChildren([generateAssemblyRoute]),
        versionsRoute.addChildren([updateAllReferencesRoute])
    ])
]);
