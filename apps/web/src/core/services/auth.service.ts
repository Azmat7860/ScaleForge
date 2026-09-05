import { computed, inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  AuthResponse,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  LoginDto,
  ResetPasswordDto,
  ResetPasswordResponse,
  SignupDto,
  UserResponse
} from "../models/auth.models";
import { AuthStoreService } from "./auth-store.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly authStore = inject(AuthStoreService);

  readonly currentUser = this.authStore.currentUser;
  readonly loading = this.authStore.loading;
  readonly initialized = this.authStore.initialized;
  readonly isAuthenticated = this.authStore.isAuthenticated;
  readonly isAdmin = this.authStore.isAdmin;
  readonly isManager = this.authStore.isManager;
  readonly role = computed(() => this.authStore.role());

  signup(payload: SignupDto): Observable<AuthResponse> {
    return this.authStore.signup(payload);
  }

  login(payload: LoginDto): Observable<AuthResponse> {
    return this.authStore.login(payload);
  }

  forgotPassword(
    payload: ForgotPasswordDto
  ): Observable<ForgotPasswordResponse> {
    return this.authStore.forgotPassword(payload);
  }

  resetPassword(
    payload: ResetPasswordDto
  ): Observable<ResetPasswordResponse> {
    return this.authStore.resetPassword(payload);
  }

  loadProfile(): Observable<UserResponse> {
    return this.authStore.loadProfile();
  }

  setCurrentUser(user: UserResponse): void {
    this.authStore.setCurrentUser(user);
  }

  logout(): void {
    this.authStore.logout();
  }
}
