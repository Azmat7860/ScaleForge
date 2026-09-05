import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { BAD_REQUEST } from "../constants/http-status";
import { ApiError } from "../utils/api-error";

export const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });

      req.body = validatedData.body;
      req.params = validatedData.params;
      req.query = validatedData.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ApiError(
            BAD_REQUEST,
            error.issues.map((issue) => issue.message).join(", ")
          )
        );
        return;
      }

      next(error);
    }
  };
