import pino, { Logger, LoggerOptions } from "pino";
import { env } from "../config/env";

const loggerOptions: LoggerOptions = {
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    env.NODE_ENV === "production"
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard"
          }
        }
};

export const logger: Logger = pino(loggerOptions);

export const createLogger = (context: string): Logger => {
  return logger.child({ context });
};
