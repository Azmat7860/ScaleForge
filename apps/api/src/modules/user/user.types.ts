import { AuthRole } from "../auth/auth.types";

export type User = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  createdAt: Date;
  lastLoginAt?: Date | null;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: AuthRole;
};

export type UpdateProfileDto = {
  name: string;
  email: string;
};

export type UpdateUserDto = {
  name: string;
  email: string;
  role: AuthRole;
};

export type UpdateUserRoleDto = {
  role: AuthRole;
};

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
};

export type GetUsersQueryDto = {
  page: number;
  limit: number;
  search?: string;
  role?: AuthRole | "all";
};

export type UserStats = {
  totalUsers: number;
  activeUsers: number;
  roleStatistics: Record<AuthRole, number>;
  queuedNotifications: number;
};

export type RoleOption = {
  label: string;
  value: AuthRole;
};
