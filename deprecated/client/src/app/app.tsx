import { Provider } from "react-redux";
import { store } from "../store/store";
import { AppNavbar } from "./app-navbar";

export default function App() {
    return (
        <Provider store={store}>
                <AppNavbar />
                <Outlet />
        </Provider>
    );
}
