import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { FocusStyleManager } from "@blueprintjs/core";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import "./app.scss";
import { PartStudioApp } from "./part-studio-app";
import { AssemblyApp } from "./assembly-app";
import { GrantDenied } from "./grant-denied";

/**
 * The root component.
 */
export function Root() {
    FocusStyleManager.onlyShowFocusOnTabs();
    return <Outlet />;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "assembly",
                element: <AssemblyApp />,
            },
            {
                path: "partstudio",
                element: <PartStudioApp />,
            },
            {
                path: "grantdenied",
                element: <GrantDenied />,
            },
        ],
    },
]);

const app = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

app.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
