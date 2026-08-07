import fs from "fs";
import path from "path";
import express from "express";
import { serverLog, userLog } from "./winston.logger.js";

const fullpath = path.join(process.cwd(),"src","utils","Logs","logger.txt")

export default function getlog(app) {
    app.use("/logs",express.static(fullpath))
    app.use("/user/logs",express.static(userLog))
    app.use("/server/logs",express.static(serverLog))
}