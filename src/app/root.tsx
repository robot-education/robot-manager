"use client";
import { FocusStyleManager } from "@blueprintjs/core";
import { ReactNode } from "react";

FocusStyleManager.onlyShowFocusOnTabs();

/**
 * A root component.
 * Used to inject FocusStyleManager into the client globally.
 */
export function Root(props: { children: ReactNode }) {
    return props.children;
}
