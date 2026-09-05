import { Response } from "express";
import { PaginatedResponse } from "../types/shared.types";

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiPaginatedSuccessResponse<T> = ApiSuccessResponse<
  PaginatedResponse<T>
>;

export const sendSuccess = <T>(
  res: Response<ApiSuccessResponse<T>>,
  statusCode: number,
  message: string,
  data: T
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};
