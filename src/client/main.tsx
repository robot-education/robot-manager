import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { FocusStyleManager } from "@blueprintjs/core";

import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "./app.scss";

import { AppNavbar } from "./common/app-navbar";
import { PartStudio } from "./routes/part-studio";
import { Assembly } from "./routes/assembly";
import { Versions } from "./routes/versions";
import { GrantDenied } from "./routes/grant-denied";
import { Icons, IconPaths } from "@blueprintjs/icons";

/**
 * The root component.
 */
export function Root() {
    FocusStyleManager.onlyShowFocusOnTabs();
    return <Outlet />;
}

export function App() {
    useEffect(() => {
        

    });

    return (
        <>
            <AppNavbar />
            <Outlet />
        </>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "app/",
                element: <App />,
                children: [
                    {
                        path: "assembly",
                        element: <Assembly />
                    },
                    {
                        path: "partstudio",
                        element: <PartStudio />
                    },
                    {
                        path: "versions",
                        element: <Versions />
                    }
                ]
            },
            {
                path: "grantdenied",
                element: <GrantDenied />
            }
        ]
    }
]);

// see https://vitejs.dev/guide/features.html#glob-import
const iconModules: Record<string, { default: IconPaths }> = import.meta.glob(
    [
        "../node_modules/@blueprintjs/icons/lib/esm/generated/16px/paths/*.js",
        "../node_modules/@blueprintjs/icons/lib/esm/generated/20px/paths/*.js"
    ],
    { eager: true }
);

Icons.setLoaderOptions({
    loader: async (name, size) =>
        iconModules[
            `../node_modules/@blueprintjs/icons/lib/esm/generated/${size}px/paths/${name}.js`
        ].default
});

const app = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

app.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
