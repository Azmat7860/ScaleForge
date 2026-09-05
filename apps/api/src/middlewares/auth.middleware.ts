import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { FORBIDDEN, UNAUTHORIZED } from "../constants/http-status";
import {
  AuthRole,
  AuthenticatedRequestUser,
  JwtPayload
} from "../modules/auth/auth.types";
import { AUTH_MESSAGES } from "../modules/auth/auth.constant";
import { ApiError } from "../utils/api-error";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new ApiError(UNAUTHORIZED, "Bearer token is required"));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user: AuthenticatedRequestUser = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role
    };

    req.user = user;
  } catch {
    next(new ApiError(UNAUTHORIZED, "Invalid or expired token"));
    return;
  }

  next();
};

export const authorizeRoles =
  (...allowedRoles: AuthRole[]): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ApiError(FORBIDDEN, AUTH_MESSAGES.FORBIDDEN));
      return;
    }

    next();
  };
