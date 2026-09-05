import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { CONFLICT, UNAUTHORIZED } from "../../constants/http-status";
import { IEmailQueueProducer } from "../../queues/email.queue";
import { EmailService } from "../../services/email.service";
import { ApiError } from "../../utils/api-error";
import { createLogger } from "../../utils/logger";
import { IActivityLogService } from "../activity/activity.interface";
import { INotificationService } from "../notification/notification.interface";
import { AUTH_MESSAGES } from "./auth.constant";
import { IAuthRepository, IAuthService } from "./auth.interface";
import {
  AuthResponseDto,
  AuthUser,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  JwtPayload,
  LoginDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
  SignupDto,
  UserResponse
} from "./auth.types";

const authLogger = createLogger("auth-service");

export class AuthService implements IAuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly emailQueueProducer: IEmailQueueProducer,
    private readonly emailService: EmailService,
    private readonly notificationService: INotificationService,
    private readonly activityLogService: IActivityLogService
  ) {}

  async signup(input: SignupDto): Promise<AuthResponseDto> {
    const existingUser = await this.authRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ApiError(CONFLICT, "Email is already registered");
    }

    const isFirstUser = (await this.authRepository.countUsers()) === 0;
    const passwordHash = await bcrypt.hash(
      input.password,
      env.BCRYPT_SALT_ROUNDS
    );

    const user = await this.authRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: isFirstUser ? "admin" : "user"
    });

    const notification =
      await this.notificationService.createWelcomeEmailNotification(user.id);

    await this.emailQueueProducer.enqueueWelcomeEmail({
      userId: user.id,
      email: user.email,
      name: user.name,
      notificationId: notification.id
    });

    await this.activityLogService.logAuthEvent({
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      action: "user-signed-up",
      description: "User signed up and welcome email was queued.",
      targetType: "user",
      targetId: user.id,
      metadata: {
        role: user.role,
        notificationStatus: notification.status
      }
    });

    authLogger.info({ userId: user.id, email: user.email }, "User signed up");

    return this.toPayload(user);
  }

  async login(input: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authRepository.findByEmail(input.email);

    if (!user) {
      throw new ApiError(UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordMatched = await bcrypt.compare(
      input.password,
      user.passwordHash
    );

    if (!isPasswordMatched) {
      throw new ApiError(UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    await this.authRepository.updateLastLoginAt(user.id);

    await this.activityLogService.logAuthEvent({
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      action: "user-logged-in",
      description: "User logged in successfully.",
      targetType: "auth",
      targetId: user.id
    });

    authLogger.info({ userId: user.id, email: user.email }, "User logged in");

    return this.toPayload(user);
  }

  async getProfile(userId: string): Promise<UserResponse> {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new ApiError(UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    }

    return this.toUserResponse(user);
  }

  async forgotPassword(
    input: ForgotPasswordDto
  ): Promise<ForgotPasswordResponseDto> {
    const user = await this.authRepository.findByEmail(input.email);

    if (!user) {
      return {
        message: AUTH_MESSAGES.PASSWORD_RESET_EMAIL_SENT
      };
    }

    const resetToken = randomBytes(24).toString("hex");
    const resetTokenHash = this.hashValue(resetToken);
    const resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 15);

    await this.authRepository.setResetPasswordToken(
      user.id,
      resetTokenHash,
      resetPasswordExpiresAt
    );

    await this.emailService.sendResetPasswordEmail(user.email, resetToken);

    await this.activityLogService.logAuthEvent({
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      action: "password-reset-requested",
      description: "Password reset token requested.",
      targetType: "auth",
      targetId: user.id
    });

    authLogger.info(
      { userId: user.id, email: user.email },
      "Password reset token generated"
    );

    return {
      message: AUTH_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
      ...(env.NODE_ENV !== "production" ? { resetToken } : {})
    };
  }

  async resetPassword(
    input: ResetPasswordDto
  ): Promise<ResetPasswordResponseDto> {
    const resetTokenHash = this.hashValue(input.token);
    const user =
      await this.authRepository.findByResetPasswordTokenHash(resetTokenHash);

    if (!user) {
      throw new ApiError(UNAUTHORIZED, "Reset token is invalid or expired");
    }

    const passwordHash = await bcrypt.hash(
      input.password,
      env.BCRYPT_SALT_ROUNDS
    );

    await this.authRepository.updatePassword(user.id, passwordHash);
    await this.authRepository.clearResetPasswordToken(user.id);

    await this.activityLogService.logAuthEvent({
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      action: "password-reset-completed",
      description: "Password was reset using a reset token.",
      targetType: "auth",
      targetId: user.id
    });

    authLogger.info({ userId: user.id, email: user.email }, "Password reset");

    return {
      message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS
    };
  }

  private toPayload(user: AuthUser): AuthResponseDto {
    return {
      accessToken: this.generateAccessToken(user),
      user: this.toUserResponse(user)
    };
  }

  private toUserResponse(user: AuthUser): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }

  private generateAccessToken(user: AuthUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
    });
  }

  private hashValue(value: string): string {
    return createHash("sha256").update(value).digest("hex");
  }
}
