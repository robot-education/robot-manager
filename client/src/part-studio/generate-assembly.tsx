import { useState } from "react";
import { FormGroup, Tooltip, InputGroup, Intent } from "@blueprintjs/core";
import { post } from "../api/api";
import { handleStringChange } from "../handlers";
import { ActionCard } from "../actions/action-card";
import { ActionForm } from "../actions/action-form";
import { ActionFunction } from "react-router-dom";
import { store } from "../store/store";
import { selectCurrentPathQuery } from "../app/app-slice";
import { ActionDialog } from "../actions/action-dialog";
import { ActionSpinner } from "../actions/action-spinner";

export function GenerateAssemblyCard() {
    return (
        <ActionCard
            title="Generate assembly"
            description="Generate a new assembly from the current part studio."
        />
    );
}

export function GenerateAssembly() {
    return (
        <ActionDialog>
            <GenerateAssemblyForm />
            <ActionSpinner message="Generating assembly" />
        </ActionDialog>
    );
}

function GenerateAssemblyForm() {
    const [assemblyName, setAssemblyName] = useState("Assembly");
    // const [autoAssemble, setAutoAssemble] = useState(true);
    const disabled = assemblyName === "";

    const options = (
        <>
            <FormGroup
                label="Assembly name"
                labelFor="assembly-name"
                labelInfo="(required)"
            >
                <Tooltip content={"The name of the generated assembly"}>
                    <InputGroup
                        name="assemblyName"
                        value={assemblyName}
                        intent={disabled ? Intent.DANGER : undefined}
                        onChange={handleStringChange(setAssemblyName)}
                    />
                </Tooltip>
            </FormGroup>
            {/* <FormGroup
            label="Execute auto assembly"
            labelFor="auto-assemble"
            inline={true}
        >
            <Tooltip
                content={
                    "Whether to execute auto assembly on the generated assembly"
                }
            >
                <Checkbox
                    id="auto-assemble"
                    checked={autoAssemble}
                    onClick={handleBooleanChange(setAutoAssemble)}
                />
            </Tooltip>
        </FormGroup> */}
        </>
    );
    return <ActionForm disabled={disabled} options={options} />;
}

export const generateAssemblyHandler: ActionFunction = async ({ request }) => {
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

// export function ExecuteGenerateAssembly() {
//     const navigation = useNavigation();
//     const navigate = useNavigate();
//     const loaderData = useLoaderData();

//     const openAssembly = loaderData && (
//         <Button
//             text="Open assembly"
//             intent="primary"
//             icon="share"
//             onClick={() => {
//                 window.open(loaderData.assemblyUrl);
//                 navigate("../..");
//             }}
//         />
//     );

//     return (
//         <ApiDialog
//             title="Generate assembly"
//             loadingMessage="Generating assembly"
//             successMessage="Successfully generated assembly"
//             successDescription="Remember to fix a part in the assembly to lock it in place."
//             successActions={openAssembly}
//         />
//     );
// }
