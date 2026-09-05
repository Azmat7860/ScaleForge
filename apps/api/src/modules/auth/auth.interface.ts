import {
  AuthResponseDto,
  AuthUser,
  CreateAuthUserInput,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  LoginDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
  SignupDto,
  UserResponse
} from "./auth.types";
import { IEmailQueueProducer } from "../../queues/email.queue";
import { IActivityLogService } from "../activity/activity.interface";
import { INotificationService } from "../notification/notification.interface";

export interface IAuthRepository {
  create(input: CreateAuthUserInput): Promise<AuthUser>;
  findByEmail(email: string): Promise<AuthUser | null>;
  findById(id: string): Promise<AuthUser | null>;
  countUsers(): Promise<number>;
  updateLastLoginAt(userId: string): Promise<void>;
  setResetPasswordToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date
  ): Promise<void>;
  findByResetPasswordTokenHash(tokenHash: string): Promise<AuthUser | null>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
  clearResetPasswordToken(userId: string): Promise<void>;
}

export interface IAuthService {
  signup(input: SignupDto): Promise<AuthResponseDto>;
  login(input: LoginDto): Promise<AuthResponseDto>;
  getProfile(userId: string): Promise<UserResponse>;
  forgotPassword(
    input: ForgotPasswordDto
  ): Promise<ForgotPasswordResponseDto>;
  resetPassword(input: ResetPasswordDto): Promise<ResetPasswordResponseDto>;
}

export interface IAuthDependencies {
  authRepository: IAuthRepository;
  emailQueueProducer: IEmailQueueProducer;
  notificationService: INotificationService;
  activityLogService: IActivityLogService;
}
