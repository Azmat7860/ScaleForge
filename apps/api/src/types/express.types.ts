import { Request } from "express";
import { ParsedQs } from "qs";
import { AuthenticatedRequestUser } from "../modules/auth/auth.types";

export type AuthenticatedRequest<
  Params = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ParsedQs
> = Request<Params, ResBody, ReqBody, ReqQuery> & {
  user?: AuthenticatedRequestUser;
};
