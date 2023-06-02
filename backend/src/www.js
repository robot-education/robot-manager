#!/usr/bin/env node
import { readFileSync } from "fs";
import { createServer } from "https";

import config from "./config";
import { app } from "./app";

const port = config.port || 3000;

const options = {
    key: readFileSync("https-cert/client-key.pem"),
    cert: readFileSync("https-cert/client-cert.pem"),
};

createServer(options, app).listen(port, () => console.log("Listening on port " + port));