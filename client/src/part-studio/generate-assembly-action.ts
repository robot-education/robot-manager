import { ActionFunction } from "react-router-dom";
import { post } from "../api/api";
import { selectCurrentPathQuery } from "../app/app-slice";
import { store } from "../store/store";

export const generateAssemblyAction: ActionFunction = async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const currentPath = selectCurrentPathQuery(store.getState());

    const result = await post("/generate-assembly", currentPath, {
        name: data.assemblyName
    }).catch(() => null);
    if (!result) {
        return { error: true };
    }

    const assemblyPath = currentPath;
    assemblyPath.elementId = result.elementId;
    const assemblyUrl = `https://cad.onshape.com/documents/${assemblyPath.documentId}/w/${assemblyPath.workspaceId}/e/${assemblyPath.elementId}`;
    // if (data.autoAssemble) {
    // const result = await post("/auto-assembly", assemblyPath.elementObject());
    // if (result == null) { return false; }
    // }
    return { error: false, assemblyUrl };
};
