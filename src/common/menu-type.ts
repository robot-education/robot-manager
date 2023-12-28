"use client";

import { BlueprintIcons_16Id } from "@blueprintjs/icons/lib/esm/generated/16px/blueprint-icons-16";
import { usePathname, useRouter } from "next/navigation";

export enum MenuType {
    PART_STUDIO = "part-studio",
    ASSEMBLY = "assembly",
    VERSIONS = "versions"
    // FEATURE_SCRIPT = "feature-script"
}

export function useCurrentMenuType(): MenuType {
    let pathname = usePathname();
    pathname = pathname.replace("/app/", "");
    for (const type of Object.values(MenuType)) {
        if (pathname.startsWith(type)) {
            return type;
        }
    }
    throw new Error("No valid menu type");
}

/**
 * Returns a handler which can be invoked to open a given menu.
 */
export function useMenuRouter() {
    const router = useRouter();
    return (menuType: MenuType) => {
        router.push("/app/" + menuType);
    };
}

interface MenuProps {
    text: string;
    icon: BlueprintIcons_16Id;
}

export function getMenuProps(menuType: MenuType): MenuProps {
    switch (menuType) {
        case MenuType.PART_STUDIO:
            return {
                text: "Part studio",
                icon: "home"
            };
        case MenuType.ASSEMBLY:
            return {
                text: "Assembly",
                icon: "home"
            };
        case MenuType.VERSIONS:
            return {
                text: "Versions",
                icon: "git-branch"
            };
    }
}
