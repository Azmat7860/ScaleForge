import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, finalize, map, Observable, tap, throwError } from "rxjs";
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
import { AuthApiService } from "./auth-api.service";
import { BrowserStorageService } from "./browser-storage.service";

const ACCESS_TOKEN_KEY = "scaleforge_access_token";
const CURRENT_USER_KEY = "scaleforge_current_user";

@Injectable({
  providedIn: "root"
})
export class AuthStoreService {
  private readonly authApiService = inject(AuthApiService);
  private readonly browserStorageService = inject(BrowserStorageService);
  private readonly router = inject(Router);

  readonly accessToken = signal<string | null>(null);
  readonly currentUser = signal<UserResponse | null>(null);
  readonly loading = signal(false);
  readonly initialized = signal(false);

  readonly isAuthenticated = computed(() => Boolean(this.accessToken()));
  readonly role = computed(() => this.currentUser()?.role ?? null);
  readonly isAdmin = computed(() => this.role() === "admin");
  readonly isManager = computed(() => {
    const role = this.role();
    return role === "admin" || role === "manager";
  });

  constructor() {
    this.hydrateSession();
  }

  signup(payload: SignupDto): Observable<AuthResponse> {
    this.loading.set(true);

    return this.authApiService.signup(payload).pipe(
      map((response) => response.data),
      tap((session) => this.persistSession(session)),
      finalize(() => this.loading.set(false))
    );
  }

  login(payload: LoginDto): Observable<AuthResponse> {
    this.loading.set(true);

    return this.authApiService.login(payload).pipe(
      map((response) => response.data),
      tap((session) => this.persistSession(session)),
      finalize(() => this.loading.set(false))
    );
  }

  forgotPassword(
    payload: ForgotPasswordDto
  ): Observable<ForgotPasswordResponse> {
    this.loading.set(true);

    return this.authApiService.forgotPassword(payload).pipe(
      map((response) => response.data),
      finalize(() => this.loading.set(false))
    );
  }

  resetPassword(
    payload: ResetPasswordDto
  ): Observable<ResetPasswordResponse> {
    this.loading.set(true);

    return this.authApiService.resetPassword(payload).pipe(
      map((response) => response.data),
      finalize(() => this.loading.set(false))
    );
  }

  loadProfile(): Observable<UserResponse> {
    return this.authApiService.getCurrentUser().pipe(
      map((response) => response.data),
      tap((user) => {
        this.currentUser.set(user);
        this.browserStorageService.setItem(CURRENT_USER_KEY, user);
        this.initialized.set(true);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.clearSession(false);
        }

        this.initialized.set(true);
        return throwError(() => error);
      })
    );
  }

  setCurrentUser(user: UserResponse): void {
    this.currentUser.set(user);
    this.browserStorageService.setItem(CURRENT_USER_KEY, user);
  }

  logout(shouldNavigate = true): void {
    this.clearSession(shouldNavigate);
  }

  private hydrateSession(): void {
    const accessToken =
      this.browserStorageService.getItem<string>(ACCESS_TOKEN_KEY);
    const currentUser =
      this.browserStorageService.getItem<UserResponse>(CURRENT_USER_KEY);

    this.accessToken.set(accessToken);
    this.currentUser.set(currentUser);

    if (accessToken) {
      this.loadProfile().subscribe({
        error: () => undefined
      });
      return;
    }

    this.initialized.set(true);
  }

  private persistSession(session: AuthResponse): void {
    this.accessToken.set(session.accessToken);
    this.currentUser.set(session.user);
    this.browserStorageService.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    this.browserStorageService.setItem(CURRENT_USER_KEY, session.user);
  }

  private clearSession(shouldNavigate: boolean): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.browserStorageService.removeItem(ACCESS_TOKEN_KEY);
    this.browserStorageService.removeItem(CURRENT_USER_KEY);

    if (shouldNavigate) {
      void this.router.navigate(["/login"]);
    }
  }
}
