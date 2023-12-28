import { PushVersionCard } from "./push-version";
import { UpdateAllReferencesCard } from "./update-all-references";

export default function Versions(): JSX.Element {
    return (
        <>
            <PushVersionCard />
            <UpdateAllReferencesCard />
        </>
    );
}
