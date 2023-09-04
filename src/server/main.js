let config = require("./config");
let { app } = require("./app");
let ViteExpress = require("vite-express");

ViteExpress.config({
    mode: config.isProduction ? "production" : "development", ignorePaths: (path) => {
        console.log(path);
        // probably not needed, should serve grantDenied normally
        return path === "/grantDenied";
    }
});

if (config.isProduction) {
    ViteExpress.listen(app, config.port);
}
else {
    const handler = () => console.log("Listening on part " + config.port)
    let { createServer } = require("https");
    let { readFileSync } = require("fs");
    const options = {
        key: readFileSync("https-cert/key.pem"),
        cert: readFileSync("https-cert/cert.pem"),
    };
    server = createServer(options, app).listen(config.port, handler);
    ViteExpress.bind(app, server);
}