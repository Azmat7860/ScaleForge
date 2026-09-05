import { Injectable } from "@angular/core";
import { PaginatedResponse } from "../models/api.models";
import {
  ChangePasswordDto,
  CreateUserDto,
  GetUsersQuery,
  RoleOption,
  UpdateProfileDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  User,
  UserStats
} from "../models/user.models";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root"
})
export class UserApiService extends ApiService {
  listUsers(query: GetUsersQuery) {
    return this.getWithQuery<PaginatedResponse<User>>("/users", query);
  }

  getUserById(userId: string) {
    return this.get<User>(`/users/${userId}`);
  }

  createUser(payload: CreateUserDto) {
    return this.post<User, CreateUserDto>("/users", payload);
  }

  updateUser(userId: string, payload: UpdateUserDto) {
    return this.put<User, UpdateUserDto>(`/users/${userId}`, payload);
  }

  deleteUser(userId: string) {
    return this.delete<{ success: boolean }>(`/users/${userId}`);
  }

  updateMyProfile(payload: UpdateProfileDto) {
    return this.put<User, UpdateProfileDto>("/profile", payload);
  }

  changePassword(payload: ChangePasswordDto) {
    return this.put<{ success: boolean }, ChangePasswordDto>(
      "/change-password",
      payload
    );
  }

  getRoles() {
    return this.get<RoleOption[]>("/users/roles/list");
  }

  getStats() {
    return this.get<UserStats>("/users/stats");
  }

  updateUserRole(userId: string, payload: UpdateUserRoleDto) {
    return this.patch<User, UpdateUserRoleDto>(`/users/${userId}/role`, payload);
  }
}
