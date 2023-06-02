import express from "express";
import autoAssembly from "../auto-assembly/auto-assembly";

export const apiRouter = express.Router();

apiRouter.post("/executeAutoAssembly", async (req, res) => {
    autoAssembly.execute(req);
    res.status(200).send("Complete");
});
