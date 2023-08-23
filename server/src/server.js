#!/usr/bin/env node
let { readFileSync } = require("fs");
let config = require("./config");
let { app } = require("./app");

const port = config.port || 3000;

if (config.isDevelopment) {
    let { createServer } = require("https");
    const options = {
        key: readFileSync("https-cert/key.pem"),
        cert: readFileSync("https-cert/cert.pem"),
    };
    createServer(options, app).listen(port, () => console.log("Listening on port " + port));
}
else {
    let { createServer } = require("http");
    createServer({}, app).listen(port, () => console.log("Listening on port " + port));
}
