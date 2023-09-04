import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Root } from "./root";
import { PartStudioApp } from "./part-studio-app";
import { AssemblyApp } from "./assembly-app";

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
        element: <PartStudioApp />
      },
    ]
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);