import { NextRequest, NextResponse } from "next/server";
import { AppType } from "@/common/app-type";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    console.log("App cookies: ");
    console.log(request.cookies);

    if (request.nextUrl.searchParams.get("needAuth") != "false") {
        const json = await fetch(process.env.BACKEND_URL + "/authorized", {
            // Have to manually include cookies in fetch
            credentials: "include",
            headers: { Cookie: request.cookies.toString() }
        })
            .then((res) => res.json())
            .catch(() => null);

        if (!json || !json["authorized"]) {
            const url = request.nextUrl;
            url.pathname = "/sign-in";
            url.searchParams.set("needAuth", "false");

            const response = NextResponse.redirect(url);
            response.headers.set("credentials", "include");
            return response;
        }
    } else {
        console.log("Already authed");
    }

    const url = request.nextUrl;
    const tabType = url.searchParams.get("appType") as AppType;
    url.pathname = "/app/" + tabType;
    return NextResponse.redirect(url);
}

// export const config = {
//     /**
//      * Match /app from Onshape
//      */
//     matcher: ["/app"]
// };
