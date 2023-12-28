import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Robot Manager",
    description: "An Onshape Application for working with robots."
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout(props: RootLayoutProps) {
    return (
        <html lang="en">
            <body>
                <div id="root">{props.children}</div>
            </body>
        </html>
    );
}
