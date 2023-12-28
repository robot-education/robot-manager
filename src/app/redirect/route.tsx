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
    return NextResponse.redirect(url);
}
