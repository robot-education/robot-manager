import { FetcherWithComponents, NavigateFunction } from "react-router-dom";

export function getCloseMenuHandler(
    fetcher: FetcherWithComponents<any>,
    navigate: NavigateFunction
) {
    return () => closeMenu(fetcher, navigate);
}

export function closeMenu(
    fetcher: FetcherWithComponents<any>,
    navigate: NavigateFunction
) {
    resetFetcher(fetcher);
    return navigate("..");
}

export function resetFetcher(fetcher: FetcherWithComponents<any>) {
    fetcher.submit({}, { action: "/reset-fetcher", method: "post" });
}
