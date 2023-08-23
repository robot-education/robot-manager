import * as React from 'react';
import * as Blueprint from '@blueprintjs/core';

import { AppNavbar } from './app-navbar';
import { makeElementPath, post } from './api';

export function AssemblyApp(): JSX.Element {
    const executeAutoAssembly = React.useCallback(async () => {
        const result = await post('auto-assembly', makeElementPath());
    }, []);

    return (<>
        <AppNavbar />
        <Blueprint.Card>
            <Blueprint.H4>Execute auto assembly</Blueprint.H4>
            <p>
                Execute the auto assembly script on parts in the current assembly.
            </p>
            {/* <Checkbox label='Resolve assembly mirror' /> */}
            <Blueprint.Button text='Execute' intent='primary' type='submit' rightIcon='arrow-right' onClick={executeAutoAssembly} />
        </Blueprint.Card>
    </>);
}

