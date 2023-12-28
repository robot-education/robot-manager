import { ElementPath } from "@/api/path";
import { useSearchParams } from "next/navigation";
import {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useContext
} from "react";
import { AppType } from "./app-type";

export interface OnshapeParams extends ElementPath {
    appType: AppType;
}

const onshapeParamsContext = createContext<OnshapeParams>(null!);

function useSaveOnshapeParams(): OnshapeParams {
    // Initial state gets used for first render before getting immediately overwritten
    const [onshapeParams, setOnshapeParams] = useState<OnshapeParams>({
        appType: AppType.PART_STUDIO,
        documentId: "",
        workspaceId: "",
        elementId: ""
    });
    const params = useSearchParams();
    useEffect(() => {
        if (params.has("appType")) {
            setOnshapeParams({
                appType: params.get("appType")! as AppType,
                documentId: params.get("documentId")!,
                workspaceId: params.get("workspaceId")!,
                workspaceOrVersion: params.get("workspaceOrVersion")!,
                elementId: params.get("elementId")!
            });
        }
    }, [params]);
    return onshapeParams;
}

export function OnshapeParamsProvider(props: { children: ReactNode }) {
    const appType = useSaveOnshapeParams();
    return (
        <onshapeParamsContext.Provider value={appType}>
            {props.children}
        </onshapeParamsContext.Provider>
    );
}

export function useAppType(): AppType {
    return useContext(onshapeParamsContext).appType;
}

export function useOnshapeParams(): OnshapeParams {
    return useContext(onshapeParamsContext);
}
