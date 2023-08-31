#!/usr/bin/env node
import { app } from "./app";
import config from "./config";
const port = config.port || 3000;

if (config.isDevelopment()) {
    let { createServer } = require("https");
    let { readFileSync } = require("fs");
    const options = {
        key: readFileSync("https-cert/key.pem"),
        cert: readFileSync("https-cert/cert.pem"),
    };
    const handler = () => console.log("Listening on part " + port)
    const server = createServer(options, app).listen(port, handler);
    ViteExpress.bind(app, server);
} else {
    ViteExpress.listen(app, port);
}