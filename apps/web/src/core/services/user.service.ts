import { computed, inject, Injectable, signal } from "@angular/core";
import { finalize, map, Observable, tap } from "rxjs";
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
import { UserApiService } from "./user-api.service";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private readonly userApiService = inject(UserApiService);

  readonly usersResponse = signal<PaginatedResponse<User> | null>(null);
  readonly selectedUser = signal<User | null>(null);
  readonly stats = signal<UserStats | null>(null);
  readonly roleOptions = signal<RoleOption[]>([]);
  readonly loading = signal(false);
  readonly filters = signal<GetUsersQuery>({
    page: 1,
    limit: 8,
    search: "",
    role: "all"
  });

  readonly users = computed(() => this.usersResponse()?.items ?? []);
  readonly totalUsers = computed(() => this.usersResponse()?.total ?? 0);
  readonly totalPages = computed(() => this.usersResponse()?.totalPages ?? 1);

  loadUsers(query?: Partial<GetUsersQuery>): Observable<PaginatedResponse<User>> {
    const nextQuery = {
      ...this.filters(),
      ...query
    };

    this.filters.set(nextQuery);
    this.loading.set(true);

    return this.userApiService.listUsers(nextQuery).pipe(
      map((response) => response.data),
      tap((data) => this.usersResponse.set(data)),
      finalize(() => this.loading.set(false))
    );
  }

  loadUserById(userId: string): Observable<User> {
    this.loading.set(true);

    return this.userApiService.getUserById(userId).pipe(
      map((response) => response.data),
      tap((user) => this.selectedUser.set(user)),
      finalize(() => this.loading.set(false))
    );
  }

  createUser(payload: CreateUserDto): Observable<User> {
    this.loading.set(true);

    return this.userApiService.createUser(payload).pipe(
      map((response) => response.data),
      finalize(() => this.loading.set(false))
    );
  }

  updateUser(userId: string, payload: UpdateUserDto): Observable<User> {
    this.loading.set(true);

    return this.userApiService.updateUser(userId, payload).pipe(
      map((response) => response.data),
      finalize(() => this.loading.set(false))
    );
  }

  deleteUser(userId: string): Observable<{ success: boolean }> {
    this.loading.set(true);

    return this.userApiService.deleteUser(userId).pipe(
      map((response) => response.data),
      finalize(() => this.loading.set(false))
    );
  }

  updateProfile(payload: UpdateProfileDto): Observable<User> {
    this.loading.set(true);

    return this.userApiService.updateMyProfile(payload).pipe(
      map((response) => response.data),
      finalize(() => this.loading.set(false))
    );
  }

  changePassword(payload: ChangePasswordDto): Observable<{ success: boolean }> {
    this.loading.set(true);

    return this.userApiService.changePassword(payload).pipe(
      map((response) => response.data),
      finalize(() => this.loading.set(false))
    );
  }

  loadRoles(): Observable<RoleOption[]> {
    return this.userApiService.getRoles().pipe(
      map((response) => response.data),
      tap((roles) => this.roleOptions.set(roles))
    );
  }

  updateUserRole(
    userId: string,
    payload: UpdateUserRoleDto
  ): Observable<User> {
    this.loading.set(true);

    return this.userApiService.updateUserRole(userId, payload).pipe(
      map((response) => response.data),
      finalize(() => this.loading.set(false))
    );
  }

  loadStats(): Observable<UserStats> {
    return this.userApiService.getStats().pipe(
      map((response) => response.data),
      tap((stats) => this.stats.set(stats))
    );
  }
}
