import { Injectable } from "@angular/core";
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
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root"
})
export class AuthApiService extends ApiService {
  signup(payload: SignupDto) {
    return this.post<AuthResponse, SignupDto>("/auth/signup", payload);
  }

  login(payload: LoginDto) {
    return this.post<AuthResponse, LoginDto>("/auth/login", payload);
  }

  forgotPassword(payload: ForgotPasswordDto) {
    return this.post<ForgotPasswordResponse, ForgotPasswordDto>(
      "/auth/forgot-password",
      payload
    );
  }

  resetPassword(payload: ResetPasswordDto) {
    return this.post<ResetPasswordResponse, ResetPasswordDto>(
      "/auth/reset-password",
      payload
    );
  }

  getCurrentUser() {
    return this.get<UserResponse>("/auth/me");
  }
}
