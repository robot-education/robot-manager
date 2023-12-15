import ViteExpress from "vite-express";

import https from "https";
import fs from "fs";

import { getApp } from "./app";
import config from "./config";

async function startServer() {
  ViteExpress.config({
    mode: config.isProduction ? "production" : "development",
    ignorePaths: (path) => path === "/api",
  });

  const app = getApp();

  if (config.isProduction) {
    ViteExpress.listen(app, config.port);
  } else {
    const credentials = {
      key: fs.readFileSync("https-cert/key.pem"),
      cert: fs.readFileSync("https-cert/cert.pem"),
    };
    const server = https.createServer(credentials, app).listen(config.port);
    await ViteExpress.bind(app, server);
    console.log(`Server ready on port ${config.port}`);
  }
}

startServer();
