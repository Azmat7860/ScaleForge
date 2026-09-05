import { z } from "zod";
import {
  forgotPasswordDtoSchema,
  loginDtoSchema,
  resetPasswordDtoSchema,
  signupDtoSchema
} from "./auth.validation";
import { Optional } from "../../types/shared.types";

export type AuthRole = "user" | "manager" | "admin";

export type SignupDto = z.infer<typeof signupDtoSchema>;

export type LoginDto = z.infer<typeof loginDtoSchema>;

export type ForgotPasswordDto = z.infer<typeof forgotPasswordDtoSchema>;

export type ResetPasswordDto = z.infer<typeof resetPasswordDtoSchema>;

export type CreateAuthUserInput = Pick<SignupDto, "name" | "email"> & {
  passwordHash: string;
} & Optional<{ role: AuthRole }, "role">;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AuthRole;
  resetPasswordTokenHash?: string | null;
  resetPasswordExpiresAt?: Date | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserResponse = Pick<
  AuthUser,
  "id" | "name" | "email" | "role" | "createdAt"
>;

export type AuthResponseDto = {
  accessToken: string;
  user: UserResponse;
};

export type ForgotPasswordResponseDto = {
  message: string;
  resetToken?: string;
};

export type ResetPasswordResponseDto = {
  message: string;
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: AuthRole;
};

export type AuthenticatedRequestUser = {
  id: string;
  email: string;
  role: AuthRole;
};
