export function Assembly(): JSX.Element {
    // const executeAutoAssembly = async () => {
    //     await post("auto-assembly", getElementPath());
    // };

    // const autoAssemblyExecuteDialog = (
    //     <ActionDialog
    //         title="Execute auto assembly"
    //         description="Execute auto assembly"
    //         execute={executeAutoAssembly}
    //         loadingMessage="Executing auto assembly"
    //         successMessage="Successfully executed auto assembly"
    //     />
    // );

    // const executeAssemblyMirror = async (): Promise<boolean> => {
    //     const result = await post("/auto-assembly", currentPathQuery());
    //     return result != null;
    // };

    const assemblyMirrorExecuteDialog = (
        <></>
        // <ApiDialog
        //     title="Assembly mirror"
        //     execute={executeAssemblyMirror}
        //     loadingMessage="Executing assembly mirror"
        //     successMessage="Successfully executed assembly mirror"
        // />
    );

    return (
        <>
            {assemblyMirrorExecuteDialog}
            {/* {autoAssemblyExecuteDialog} */}
        </>
    );
}
