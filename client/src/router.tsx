import { createBrowserRouter } from "react-router-dom";

import { GrantDenied } from "./grant-denied";
import { App } from "./app/app";
import { PartStudio } from "./part-studio/part-studio";
import { Assembly } from "./app/assembly";
import { Versions } from "./versions/versions";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GenerateAssembly } from "./part-studio/generate-assembly";
import { generateAssemblyAction } from "./part-studio/generate-assembly-action";
import { PushVersion } from "./versions/push-version";
import { UpdateAllReferences } from "./versions/update-all-references";

const appElement = (
    <Provider store={store}>
        <App />
    </Provider>
);

export const router = createBrowserRouter([
    {
        path: "/grantdenied",
        element: <GrantDenied />
    },
    {
        path: "/app",
        element: appElement,
        children: [
            {
                path: "assembly",
                element: <Assembly />
            },
            {
                path: "part-studio",
                element: <PartStudio />,
                children: [
                    {
                        path: "generate-assembly",
                        element: <GenerateAssembly />,
                        action: generateAssemblyAction
                    }
                ]
            },
            {
                path: "versions",
                element: <Versions />,
                children: [
                    {
                        path: "push-version",
                        element: <PushVersion />
                    },
                    {
                        path: "update-all-references",
                        element: <UpdateAllReferences />
                    }
                ]
            }
        ]
    }
]);
