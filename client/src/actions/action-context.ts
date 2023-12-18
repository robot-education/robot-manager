import { createContext } from "react";

export const actionContext = createContext<ActionInfo>({
    title: "",
    description: "",
    key: ""
});
export const ActionContextProvider = actionContext.Provider;

export interface ActionInfo {
    title: string;
    description: string;
    key: string;
}

export function makeActionInfo(title: string, description: string) {
    const words = title.toLowerCase().split(" ");
    return {
        title,
        description,
        key: words.join("-")
    };
}
