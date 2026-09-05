import { NextFunction, Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/http-status";
import { env } from "../config/env";
import { createLogger } from "../utils/logger";
import { getErrorMessage, isApiError } from "../utils/error.utils";

const errorLogger = createLogger("error-middleware");

export const notFoundHandler = (
  req: Request,
  res: Response
): Response => {
  errorLogger.warn(
    {
      method: req.method,
      path: req.originalUrl
    },
    "Route not found"
  );

  return res.status(404).json({
    success: false,
    message: "Route not found"
  });
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): Response => {
  void next;

  const statusCode = isApiError(error)
    ? error.statusCode
    : INTERNAL_SERVER_ERROR;
  const errorMessage = getErrorMessage(error);

  errorLogger.error(
    {
      statusCode,
      method: _req.method,
      path: _req.originalUrl,
      error: errorMessage
    },
    "Request failed"
  );

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
    ...(env.NODE_ENV !== "production" ? { stack: error.stack } : {})
  });
};
