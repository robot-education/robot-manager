import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * This route gets called by Onshape after the user signs in through Onshape's portal.
 * We forward the request to the backend for additional handling.
 */
export async function GET(request: NextRequest) {
    console.log("Redirect cookies:");
    console.log(request.cookies.toString());

    const url = process.env.BACKEND_URL + "/redirect" + request.nextUrl.search;

    const response = NextResponse.redirect(url);
    response.headers.set("credentials", "include");
    return response;

    // const response = await fetch(url, {
    //     headers: {
    //         Cookie: request.cookies.toString()
    //     }
    // });
    // const json = await response.json();
    // return NextResponse.redirect(json.redirectUrl);

    // console.log(url);
    // const response = await fetch(url, {
    //     headers: { Cookie: request.cookies.toString() }
    // });
    // console.log("Received cookies:");
    // console.log(response.headers.getSetCookie());
    // const data = await response.json();
    // console.log(data);
    // return NextResponse.redirect(data.redirectUrl);
}
