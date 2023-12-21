import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { FocusStyleManager } from "@blueprintjs/core";
// import { Icons, IconPaths } from "@blueprintjs/icons";

import { router } from "./router";

import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "./app.scss";
import { RouterProvider } from "@tanstack/react-router";

FocusStyleManager.onlyShowFocusOnTabs();

// see https://vitejs.dev/guide/features.html#glob-import
// const iconModules: Record<string, { default: IconPaths }> = import.meta.glob(
//     [
//         "../../node_modules/@blueprintjs/icons/lib/esm/generated/16px/paths/*.js",
//         "../../node_modules/@blueprintjs/icons/lib/esm/generated/20px/paths/*.js"
//     ],
//     { eager: true }
// );

// Icons.setLoaderOptions({
//     loader: async (name, size) =>
//         iconModules[
//             `../../node_modules/@blueprintjs/icons/lib/esm/generated/${size}px/paths/${name}.js`
//         ].default
// });

const app = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
app.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);

// const rootElement = document.getElementById("app")!;
// if (!rootElement.innerHTML) {
//     const root = ReactDOM.createRoot(rootElement);
//     root.render(
//         <StrictMode>
//             <RouterProvider router={router} />
//         </StrictMode>
//     );
// }
