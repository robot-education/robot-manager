let config = require("./config");
let { app } = require("./app");
let ViteExpress = require("vite-express");

async function startServer() {
    ViteExpress.config({ mode: config.isProduction ? "production" : "development" });

    if (config.isProduction) {
        ViteExpress.listen(app, config.port);
    }
    else {
        let { createServer } = require("https");
        let { readFileSync } = require("fs");

        const options = {
            key: readFileSync("https-cert/key.pem"),
            cert: readFileSync("https-cert/cert.pem"),
        };
        const handler = () => console.log(`Listening on port ${config.port}\nStarting the vite server`);
        server = createServer(options, app).listen(config.port, handler);
        await ViteExpress.bind(app, server);
        console.log("Server started");
    }
}

startServer();