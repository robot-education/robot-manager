import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    console.log("Post cookies: ");
    console.log(request.cookies);
    const response = NextResponse.redirect(
        process.env.BACKEND_URL + "/generate-assembly" + request.nextUrl.search
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
        "Access-Control-Allow-Origin",
        "http://localhost:8080"
    );
    return response;
}

// export const config = {
//     /**
//      * Match /app from Onshape
//      */
//     matcher: ["/app"]
// };
