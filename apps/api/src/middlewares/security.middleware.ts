import { NextFunction, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { appConfig, corsOptions, helmetConfig } from "../config/app.config";
import { apiRateLimiter } from "../config/rate-limit";
import { createLogger } from "../utils/logger";
import cors from "cors";
import express from "express";
import helmet from "helmet";

const securityLogger = createLogger("security");

export const securityMiddlewares = [
  helmet(helmetConfig),
  cors(corsOptions),
  apiRateLimiter,
  express.json({ limit: appConfig.bodySizeLimit }),
  express.urlencoded({ extended: true, limit: appConfig.bodySizeLimit }),
  mongoSanitize(),
  hpp()
] as const;

export const requestAuditMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  securityLogger.info(
    {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip
    },
    "Incoming request"
  );

  next();
};
