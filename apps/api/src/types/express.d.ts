import { AuthenticatedRequestUser } from "../modules/auth/auth.types";
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedRequestUser;
    }
  }
}

export {};
