import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { FocusStyleManager } from "@blueprintjs/core";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./app.scss";

import { AppNavbar } from "./common/app-navbar";
import { PartStudio } from "./routes/part-studio";
import { Assembly } from "./routes/assembly";
import { Versions } from "./routes/versions";
import { GrantDenied } from "./routes/grant-denied";

/**
 * The root component.
 */
export function Root() {
    FocusStyleManager.onlyShowFocusOnTabs();
    return (
        <>
            <AppNavbar />
            <Outlet />
        </>
    );
}

const unused = true;

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
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
        path: "/grantdenied",
        element: <GrantDenied />
    }
]);

const app = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

app.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
