import { RoutePaths } from "@tanstack/react-router";
import { createContext } from "react";

export interface ActionInfo {
    title: string;
    description: string;
    parentId: RoutePaths<any>;
    route: any;
}

export const actionContext = createContext<ActionInfo>(null!);
export const ActionContextProvider = actionContext.Provider;
