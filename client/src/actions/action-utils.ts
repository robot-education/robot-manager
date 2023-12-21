import { router } from "../router";

export function closeMenu() {
    router.navigate({ to: ".." });
}
