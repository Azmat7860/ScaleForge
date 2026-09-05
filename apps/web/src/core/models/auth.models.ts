export type AuthRole = "admin" | "manager" | "user";

export type LoginDto = {
  email: string;
  password: string;
};

export type SignupDto = {
  name: string;
  email: string;
  password: string;
};

export type ForgotPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  token: string;
  password: string;
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: UserResponse;
};

export type ForgotPasswordResponse = {
  message: string;
  resetToken?: string;
};

export type ResetPasswordResponse = {
  message: string;
};
