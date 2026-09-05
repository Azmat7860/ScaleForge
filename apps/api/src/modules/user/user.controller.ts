import { Request, Response } from "express";
import { CREATED, OK, UNAUTHORIZED } from "../../constants/http-status";
import { AuthenticatedRequest } from "../../types/express.types";
import { ApiError } from "../../utils/api-error";
import {
  ApiPaginatedSuccessResponse,
  ApiSuccessResponse,
  sendSuccess
} from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { USER_MESSAGES } from "./user.constant";
import { IUserService } from "./user.interface";
import {
  CreateUserInput,
  GetUsersQueryDto,
  RoleOption,
  ChangePasswordDto,
  UpdateProfileDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  User,
  UserStats
} from "./user.types";

export class UserController {
  constructor(private readonly userService: IUserService) {}

  getAllUsers = asyncHandler(
    async (
      req: Request,
      res: Response<ApiPaginatedSuccessResponse<User>>
    ) => {
      const users = await this.userService.getAllUsers(
        req.query as unknown as GetUsersQueryDto
      );

      return sendSuccess(res, OK, USER_MESSAGES.FETCHED, users);
    }
  );

  getProfile = asyncHandler(
    async (req: Request, res: Response<ApiSuccessResponse<User>>) => {
    const user = await this.userService.getUserById(req.params.id);

    return sendSuccess(res, OK, USER_MESSAGES.PROFILE_FETCHED, user);
    }
  );

  createUser = asyncHandler(
    async (
      req: Request<Record<string, never>, ApiSuccessResponse<User>, CreateUserInput>,
      res: Response<ApiSuccessResponse<User>>
    ) => {
      const user = await this.userService.createUser(req.body);

      return sendSuccess(res, CREATED, "User created successfully", user);
    }
  );

  updateUser = asyncHandler(
    async (
      req: AuthenticatedRequest<
        { id: string },
        ApiSuccessResponse<User>,
        UpdateUserDto
      >,
      res: Response<ApiSuccessResponse<User>>
    ) => {
      if (!req.user) {
        throw new ApiError(UNAUTHORIZED, "Unauthorized request");
      }

      const user = await this.userService.updateUser(
        req.params.id,
        req.body,
        req.user.id
      );

      return sendSuccess(res, OK, USER_MESSAGES.UPDATED, user);
    }
  );

  updateMyProfile = asyncHandler(
    async (
      req: AuthenticatedRequest<
        Record<string, never>,
        ApiSuccessResponse<User>,
        UpdateProfileDto
      >,
      res: Response<ApiSuccessResponse<User>>
    ) => {
      if (!req.user) {
        throw new ApiError(UNAUTHORIZED, "Unauthorized request");
      }

      const user = await this.userService.updateMyProfile(req.user.id, req.body);

      return sendSuccess(res, OK, USER_MESSAGES.PROFILE_UPDATED, user);
    }
  );

  getMyProfile = asyncHandler(
    async (
      req: AuthenticatedRequest,
      res: Response<ApiSuccessResponse<User>>
    ) => {
      if (!req.user) {
        throw new ApiError(UNAUTHORIZED, "Unauthorized request");
      }

      const user = await this.userService.getUserById(req.user.id);

      return sendSuccess(res, OK, USER_MESSAGES.PROFILE_FETCHED, user);
    }
  );

  updateUserRole = asyncHandler(
    async (
      req: Request<{ id: string }, ApiSuccessResponse<User>, UpdateUserRoleDto>,
      res: Response<ApiSuccessResponse<User>>
    ) => {
      const user = await this.userService.updateUserRole(
        req.params.id,
        req.body.role
      );

      return sendSuccess(res, OK, USER_MESSAGES.ROLE_UPDATED, user);
    }
  );

  deleteUser = asyncHandler(
    async (
      req: AuthenticatedRequest<
        { id: string },
        ApiSuccessResponse<{ success: boolean }>
      >,
      res: Response<ApiSuccessResponse<{ success: boolean }>>
    ) => {
      if (!req.user) {
        throw new ApiError(UNAUTHORIZED, "Unauthorized request");
      }

      await this.userService.deleteUser(req.params.id, req.user.id);

      return sendSuccess(res, OK, USER_MESSAGES.DELETED, {
        success: true
      });
    }
  );

  changeMyPassword = asyncHandler(
    async (
      req: AuthenticatedRequest<
        Record<string, never>,
        ApiSuccessResponse<{ success: boolean }>,
        ChangePasswordDto
      >,
      res: Response<ApiSuccessResponse<{ success: boolean }>>
    ) => {
      if (!req.user) {
        throw new ApiError(UNAUTHORIZED, "Unauthorized request");
      }

      await this.userService.changeMyPassword(req.user.id, req.body);

      return sendSuccess(res, OK, USER_MESSAGES.PASSWORD_CHANGED, {
        success: true
      });
    }
  );

  getRoleOptions = asyncHandler(
    async (
      _req: Request,
      res: Response<ApiSuccessResponse<RoleOption[]>>
    ) => {
      const roles = await this.userService.getRoleOptions();

      return sendSuccess(res, OK, USER_MESSAGES.ROLES_FETCHED, roles);
    }
  );

  getDashboardStats = asyncHandler(
    async (
      _req: Request,
      res: Response<ApiSuccessResponse<UserStats>>
    ) => {
      const stats = await this.userService.getDashboardStats();

      return sendSuccess(res, OK, USER_MESSAGES.STATS_FETCHED, stats);
    }
  );
}
