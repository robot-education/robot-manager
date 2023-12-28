import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ElementPath, PathType, getCurrentPath, toQuery } from "../api/path";
import { TabType } from "../api/tab-type";

interface AppState {
    tabType: TabType;
    currentPath: ElementPath;
}

const initializeState = (): AppState => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
        tabType: searchParams.get("tabType") as TabType,
        currentPath: getCurrentPath(searchParams)
    };
};

export const appSlice = createSlice({
    name: "app",
    initialState: initializeState,
    reducers: {
        setTabType: (state, action: PayloadAction<TabType>) => {
            state.tabType = action.payload;
        },
        setCurrentPath: (state, action: PayloadAction<ElementPath>) => {
            state.currentPath = action.payload;
        }
    },
    selectors: {
        selectTabType: (state): TabType => state.tabType,
        selectCurrentPath: (state): ElementPath => state.currentPath,
        selectCurrentPathQuery: (
            state,
            pathType: PathType = PathType.ELEMENT
        ) => toQuery(state.currentPath, pathType)
    }
});

export const appReducer = appSlice.reducer;
export const { setTabType, setCurrentPath } = appSlice.actions;
export const { selectTabType, selectCurrentPath, selectCurrentPathQuery } =
    appSlice.selectors;
