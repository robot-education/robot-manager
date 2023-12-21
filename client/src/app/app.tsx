import { Provider } from "react-redux";
import { store } from "../store/store";
import { AppNavbar } from "./app-navbar";
import { Outlet } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../query";

export function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AppNavbar />
                <Outlet />
            </QueryClientProvider>
        </Provider>
    );
}
