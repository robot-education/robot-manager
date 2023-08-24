#!/usr/bin/env node
let { app } = require("./app");
let config = require("./config");
const port = config.port || 3000;
const handler = () => console.log("Listening on part " + port)

if (config.isDevelopment()) {
    let { createServer } = require("https");
    let { readFileSync } = require("fs");
    const options = {
        key: readFileSync("https-cert/key.pem"),
        cert: readFileSync("https-cert/cert.pem"),
    };
    createServer(options, app).listen(port, handler);
}
else {
    let { createServer } = require("http");
    createServer({}, app).listen(port, handler);
}
