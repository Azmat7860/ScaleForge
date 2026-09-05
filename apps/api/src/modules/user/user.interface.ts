import { IAuthRepository } from "../auth/auth.interface";
import { IActivityLogService } from "../activity/activity.interface";
import { CreateUserInput, User } from "./user.types";
import { PaginatedResponse } from "../../types/shared.types";
import {
  ChangePasswordDto,
  GetUsersQueryDto,
  RoleOption,
  UpdateProfileDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  UserStats
} from "./user.types";

export interface IUserRepository {
  findAll(
    query: GetUsersQueryDto
  ): Promise<{ items: User[]; total: number }>;
  findById(id: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  updateProfile(userId: string, input: UpdateProfileDto): Promise<User | null>;
  updateUser(userId: string, input: UpdateUserDto): Promise<User | null>;
  updateRole(userId: string, role: UpdateUserRoleDto["role"]): Promise<User | null>;
  deleteById(userId: string): Promise<boolean>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
  getStats(): Promise<UserStats>;
}

export interface IUserService {
  getAllUsers(query: GetUsersQueryDto): Promise<PaginatedResponse<User>>;
  getUserById(id: string): Promise<User>;
  createUser(input: CreateUserInput): Promise<User>;
  updateMyProfile(userId: string, input: UpdateProfileDto): Promise<User>;
  updateUser(userId: string, input: UpdateUserDto, actorId: string): Promise<User>;
  deleteUser(userId: string, actorId: string): Promise<void>;
  updateUserRole(userId: string, role: UpdateUserRoleDto["role"]): Promise<User>;
  getRoleOptions(): Promise<RoleOption[]>;
  changeMyPassword(userId: string, input: ChangePasswordDto): Promise<void>;
  getDashboardStats(): Promise<UserStats>;
}

export interface IUserDependencies {
  userRepository: IUserRepository;
  authRepository: IAuthRepository;
  activityLogService: IActivityLogService;
}
