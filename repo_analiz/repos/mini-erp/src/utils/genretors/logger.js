// src/utils/resurs/userLogs/logger.js

import winston from "winston";
import path from "path";

const userLogsPath = path.join(process.cwd(), "src", "utils", "resurs", "userLogs", "user.logger.log");
const serverLogsPath = path.join(process.cwd(), "src", "utils", "resurs", "serverLogs", "server.logger.log");

const customFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${stack ||  message}`;
});


export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }), // ⚠️ stack trace ni qo‘shadi
    customFormat
  ),
  transports: [
    new winston.transports.File({ filename: serverLogsPath, level: "error" }),
    new winston.transports.File({ filename: userLogsPath, level: "info" }),
  ],
});


