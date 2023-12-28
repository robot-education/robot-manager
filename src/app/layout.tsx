import type { Metadata } from "next";

import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "./app.scss";

import { Root } from "./root";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Robot Manager",
    description: "An Onshape app for automating common robot design workflows."
};

export default function RootLayout(props: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Root>{props.children}</Root>
            </body>
        </html>
    );
}
