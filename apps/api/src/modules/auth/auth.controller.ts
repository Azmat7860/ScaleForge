import { Request, Response } from "express";
import { CREATED, OK, UNAUTHORIZED } from "../../constants/http-status";
import { AuthenticatedRequest } from "../../types/express.types";
import { ApiError } from "../../utils/api-error";
import { ApiSuccessResponse, sendSuccess } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { AUTH_MESSAGES } from "./auth.constant";
import { IAuthService } from "./auth.interface";
import {
  AuthResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  LoginDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
  SignupDto,
  UserResponse
} from "./auth.types";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  signup = asyncHandler(
    async (
      req: Request<Record<string, never>, ApiSuccessResponse<AuthResponseDto>, SignupDto>,
      res: Response<ApiSuccessResponse<AuthResponseDto>>
    ) => {
      const payload = await this.authService.signup(req.body);

      return sendSuccess(res, CREATED, AUTH_MESSAGES.REGISTERED, payload);
    }
  );

  login = asyncHandler(
    async (
      req: Request<Record<string, never>, ApiSuccessResponse<AuthResponseDto>, LoginDto>,
      res: Response<ApiSuccessResponse<AuthResponseDto>>
    ) => {
      const payload = await this.authService.login(req.body);

      return sendSuccess(res, OK, AUTH_MESSAGES.LOGIN_SUCCESS, payload);
    }
  );

  forgotPassword = asyncHandler(
    async (
      req: Request<
        Record<string, never>,
        ApiSuccessResponse<ForgotPasswordResponseDto>,
        ForgotPasswordDto
      >,
      res: Response<ApiSuccessResponse<ForgotPasswordResponseDto>>
    ) => {
      const payload = await this.authService.forgotPassword(req.body);

      return sendSuccess(
        res,
        OK,
        AUTH_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
        payload
      );
    }
  );

  resetPassword = asyncHandler(
    async (
      req: Request<
        Record<string, never>,
        ApiSuccessResponse<ResetPasswordResponseDto>,
        ResetPasswordDto
      >,
      res: Response<ApiSuccessResponse<ResetPasswordResponseDto>>
    ) => {
      const payload = await this.authService.resetPassword(req.body);

      return sendSuccess(res, OK, AUTH_MESSAGES.PASSWORD_RESET_SUCCESS, payload);
    }
  );

  getProfile = asyncHandler(
    async (
      req: AuthenticatedRequest<
        Record<string, never>,
        ApiSuccessResponse<UserResponse>
      >,
      res: Response<ApiSuccessResponse<UserResponse>>
    ) => {
      const authenticatedUser = req.user;

      if (!authenticatedUser) {
        throw new ApiError(UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
      }

      const payload = await this.authService.getProfile(authenticatedUser.id);

      return sendSuccess(res, OK, AUTH_MESSAGES.PROFILE_FETCHED, payload);
    }
  );
}
