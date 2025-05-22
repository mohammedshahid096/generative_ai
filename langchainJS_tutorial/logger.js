import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, splat } = format;

const DevelopmentLogger = () => {
  return createLogger({
    level: "debug",
    format: combine(timestamp(), json(), splat()),
    transports: [
      //   new transports.Console(),
      new transports.File({ filename: "app-combined.log" }),
      //   new transports.File({ filename: "app-error.log", level: "error" }),
      new transports.File({ filename: "app-info.log", level: "info" }),
      //   new transports.File({ filename: "app-debug.log", level: "debug" }),
    ],
  });
};

const logger = DevelopmentLogger();

export default logger;
