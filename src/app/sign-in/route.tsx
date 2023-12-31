import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * A sign-in endpoint.
 * This function may be invoked by /app middleware or by Onshape directly.
 * If invoked by Onshape directly, Onshape will include an onshapeRedirectUrl to use.
 * Otherwise, we use the current url (including params) set to /app as the redirect url.
 */
export async function GET(request: NextRequest) {
    // use nextUrl to keep query params
    let redirectUrl: string;
    const searchParams = request.nextUrl.searchParams;
    if (searchParams.has("redirectOnshapeUri")) {
        redirectUrl = searchParams.get("redirectOnshapeUri")!;
    } else {
        const temp = request.nextUrl;
        temp.pathname = "/app";
        redirectUrl = temp.toString();
    }
    // no search params
    const grantDeniedUrl = new URL("/grant-denied", request.url).toString();

    const url = new URL(process.env.BACKEND_URL + "/sign-in");
    url.searchParams.set("redirectUrl", redirectUrl);
    url.searchParams.set("grantDeniedUrl", grantDeniedUrl);

    // await fetch(url, {
    //     headers: {
    //         Cookie: request.cookies.toString()
    //     }
    // });
    // return NextResponse.redirect("https://oauth.onshape.com/authorize", {
    //     headers: {
    //         Cookie: request.cookies.toString()
    //     }
    // });
    const response = NextResponse.redirect(url);
    response.headers.set("credentials", "include");
    return response;
}
