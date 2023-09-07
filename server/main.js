let config = require("./config");
let { app } = require("./app");
let ViteExpress = require("vite-express");

async function startServer() {
    ViteExpress.config({
        mode: config.isProduction ? "production" : "development",
        ignorePaths: (path) => path === "/api",
    });

    if (config.isProduction) {
        ViteExpress.listen(app, config.port);
    } else {
        let { createServer } = require("https");
        let { readFileSync } = require("fs");

        const options = {
            key: readFileSync("https-cert/key.pem"),
            cert: readFileSync("https-cert/cert.pem"),
        };
        const server = createServer(options, app).listen(config.port, () => {});
        await ViteExpress.bind(app, server);
        console.log(`Server ready on port ${config.port}`);
    }
}

startServer();
