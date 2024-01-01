import express, { RequestHandler } from "express";
import ViteExpress from "vite-express";
import https from "https";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const appHandler: RequestHandler = async (req, res, next) => {
    console.log("App");
    const json = await fetch(process.env.BACKEND_URL + "/authorized", {
        // Have to manually include cookies in fetch
        credentials: "include"
        // headers: { Cookie: request.cookies.toString() }
    })
        .then((res) => res.json())
        .catch(() => null);

    if (!json || !json["authorized"]) {
        const search = new URL("temp://" + req.url).search;
        return res.redirect("/sign-in" + search);
    }

    console.log("Auth succeeded");
    return next();
    // const url = request.nextUrl;
    // const tabType = url.searchParams.get("appType") as AppType;
    // url.pathname = "/app/" + tabType;
    // return NextResponse.redirect(url);
    // return next();
};
app.get("/app", appHandler);

const signInHandler: RequestHandler = (req, res) => {
    // use nextUrl to keep query params
    console.log("Sign in");

    let redirectUrl: string;
    if (req.query && req.query.redirectOnshapeUri) {
        redirectUrl = req.query.redirectOnshapeUri as string;
    } else {
        const search = new URL("temp://" + req.url).search;
        redirectUrl = process.env.FRONTEND_URL + "/app" + search;
    }
    // no search params
    const grantDeniedUrl = process.env.FRONTEND_URL + "/grant-denied";

    const url = new URL("/sign-in", process.env.BACKEND_URL);
    url.searchParams.set("redirectUrl", redirectUrl);
    url.searchParams.set("grantDeniedUrl", grantDeniedUrl);
    return res.redirect(url.toString());
};
app.get("/sign-in", signInHandler);

const redirectHandler: RequestHandler = (req, res) => {
    return res.redirect(process.env.BACKEND_URL + req.url);
};
app.get("/redirect", redirectHandler);

if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    const server = https.createServer(
        {
            key: fs.readFileSync("./certificates/localhost-key.pem"),
            cert: fs.readFileSync("./certificates/localhost.pem")
        },
        app
    );
    server.listen(port, () => {
        console.log("Server is listening on port " + port);
    });
    ViteExpress.bind(app, server);
}
