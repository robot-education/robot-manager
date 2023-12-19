import { NavigateFunction } from "react-router-dom";

export function getCloseMenuHandler(navigate: NavigateFunction) {
    return () => closeMenu(navigate);
}

export function closeMenu(navigate: NavigateFunction) {
    return navigate("..");
}