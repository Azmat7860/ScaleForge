import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import { CACHE_KEYS } from "../../cache/cache.keys";
import { ICacheService } from "../../cache/cache.service";
import { BAD_REQUEST } from "../../constants/http-status";
import { createPaginatedResponse } from "../../utils/pagination";
import { ApiError } from "../../utils/api-error";
import { IActivityLogService } from "../activity/activity.interface";
import { IAuthRepository } from "../auth/auth.interface";
import { IUserRepository, IUserService } from "./user.interface";
import { USER_MESSAGES } from "./user.constant";
import {
  ChangePasswordDto,
  CreateUserInput,
  GetUsersQueryDto,
  RoleOption,
  UpdateProfileDto,
  UpdateUserDto,
  User
} from "./user.types";

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cacheService: ICacheService,
    private readonly authRepository: IAuthRepository,
    private readonly activityLogService: IActivityLogService
  ) {}

  async getAllUsers(query: GetUsersQueryDto) {
    const { items, total } = await this.userRepository.findAll(query);

    return createPaginatedResponse(items, query.page, query.limit, total);
  }

  async getUserById(id: string): Promise<User> {
    const cacheKey = CACHE_KEYS.userProfile(id);
    const cachedUser = await this.cacheService.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ApiError(404, USER_MESSAGES.NOT_FOUND);
    }

    await this.cacheService.set(cacheKey, user, {
      ttlInSeconds: 60 * 5
    });

    return user;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const user = await this.userRepository.create(input);

    await this.cacheService.set(CACHE_KEYS.userProfile(user.id), user, {
      ttlInSeconds: 60 * 5
    });

    await this.activityLogService.logSystemEvent({
      action: "user-created",
      description: "A user account was created by an administrator.",
      targetType: "user",
      targetId: user.id,
      metadata: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    return user;
  }

  async updateMyProfile(userId: string, input: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.updateProfile(userId, input);

    if (!user) {
      throw new ApiError(404, USER_MESSAGES.NOT_FOUND);
    }

    await this.cacheService.set(CACHE_KEYS.userProfile(user.id), user, {
      ttlInSeconds: 60 * 5
    });

    await this.activityLogService.logSystemEvent({
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      action: "profile-updated",
      description: "Profile details were updated.",
      targetType: "user",
      targetId: user.id
    });

    return user;
  }

  async updateUser(
    userId: string,
    input: UpdateUserDto,
    actorId: string
  ): Promise<User> {
    const actor = await this.userRepository.findById(actorId);

    if (!actor) {
      throw new ApiError(404, USER_MESSAGES.NOT_FOUND);
    }

    const user = await this.userRepository.updateUser(userId, input);

    if (!user) {
      throw new ApiError(404, USER_MESSAGES.NOT_FOUND);
    }

    await this.cacheService.set(CACHE_KEYS.userProfile(user.id), user, {
      ttlInSeconds: 60 * 5
    });

    await this.activityLogService.logSystemEvent({
      actorId: actor.id,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "profile-updated",
      description: "An administrator updated a user account.",
      targetType: "user",
      targetId: user.id,
      metadata: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    return user;
  }

  async updateUserRole(userId: string, role: User["role"]): Promise<User> {
    const user = await this.userRepository.updateRole(userId, role);

    if (!user) {
      throw new ApiError(404, USER_MESSAGES.NOT_FOUND);
    }

    await this.cacheService.set(CACHE_KEYS.userProfile(user.id), user, {
      ttlInSeconds: 60 * 5
    });

    await this.activityLogService.logSystemEvent({
      action: "role-updated",
      description: `User role updated to ${role}.`,
      targetType: "user",
      targetId: user.id,
      metadata: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role
      }
    });

    return user;
  }

  async deleteUser(userId: string, actorId: string): Promise<void> {
    if (userId === actorId) {
      throw new ApiError(400, "You cannot delete your own account");
    }

    const actor = await this.userRepository.findById(actorId);

    if (!actor) {
      throw new ApiError(404, USER_MESSAGES.NOT_FOUND);
    }

    const targetUser = await this.userRepository.findById(userId);

    if (!targetUser) {
      throw new ApiError(404, USER_MESSAGES.NOT_FOUND);
    }

    const deleted = await this.userRepository.deleteById(userId);

    if (!deleted) {
      throw new ApiError(404, USER_MESSAGES.NOT_FOUND);
    }

    await this.cacheService.del(CACHE_KEYS.userProfile(userId));

    await this.activityLogService.logSystemEvent({
      actorId: actor.id,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "user-created",
      description: "An administrator deleted a user account.",
      targetType: "user",
      targetId: userId,
      metadata: {
        deletedUserId: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role
      }
    });
  }

  async getRoleOptions(): Promise<RoleOption[]> {
    return [
      {
        label: "Admin",
        value: "admin"
      },
      {
        label: "Manager",
        value: "manager"
      },
      {
        label: "User",
        value: "user"
      }
    ];
  }

  async changeMyPassword(userId: string, input: ChangePasswordDto): Promise<void> {
    const authUser = await this.authRepository.findById(userId);

    if (!authUser) {
      throw new ApiError(404, USER_MESSAGES.NOT_FOUND);
    }

    const currentPasswordMatches = await bcrypt.compare(
      input.currentPassword,
      authUser.passwordHash
    );

    if (!currentPasswordMatches) {
      throw new ApiError(BAD_REQUEST, "Current password is incorrect");
    }

    if (input.currentPassword === input.newPassword) {
      throw new ApiError(
        BAD_REQUEST,
        "New password must be different from current password"
      );
    }

    const newPasswordHash = await bcrypt.hash(
      input.newPassword,
      env.BCRYPT_SALT_ROUNDS
    );

    await this.authRepository.updatePassword(userId, newPasswordHash);

    await this.activityLogService.logAuthEvent({
      actorId: authUser.id,
      actorName: authUser.name,
      actorEmail: authUser.email,
      action: "password-changed",
      description: "Password changed from the profile settings screen.",
      targetType: "auth",
      targetId: authUser.id
    });
  }

  async getDashboardStats() {
    return this.userRepository.getStats();
  }
}
