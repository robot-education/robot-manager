#!/usr/bin/env node
let { readFileSync } = require("fs");
let { createServer } = require("https");

let config = require("./config");
let { app } = require("./app");

const port = config.port || 3000;

const options = config.isDevelopment() ? {
    key: readFileSync("https-cert/key.pem"),
    cert: readFileSync("https-cert/cert.pem"),
} : {};

createServer(options, app).listen(port, () => console.log("Listening on port " + port));