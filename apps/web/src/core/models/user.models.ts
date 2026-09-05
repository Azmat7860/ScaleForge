import { AuthRole } from "./auth.models";

export type User = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  createdAt: string;
  lastLoginAt?: string | null;
};

export type CreateUserDto = {
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

export type RoleOption = {
  label: string;
  value: AuthRole;
};

export type GetUsersQuery = {
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

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
};
