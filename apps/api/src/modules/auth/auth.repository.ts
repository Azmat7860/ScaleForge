import { HydratedDocument } from "mongoose";
import { AuthUserModel, AuthUserModelShape } from "./auth.model";
import { IAuthRepository } from "./auth.interface";
import { AuthUser, CreateAuthUserInput } from "./auth.types";

export class AuthRepository implements IAuthRepository {
  async create(input: CreateAuthUserInput): Promise<AuthUser> {
    const authUser = await AuthUserModel.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: input.passwordHash,
      role: input.role ?? "user"
    });

    return this.toDomain(authUser);
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const authUser = await AuthUserModel.findOne({
      email: email.toLowerCase()
    });

    return authUser ? this.toDomain(authUser) : null;
  }

  async findById(id: string): Promise<AuthUser | null> {
    const authUser = await AuthUserModel.findById(id);

    return authUser ? this.toDomain(authUser) : null;
  }

  async countUsers(): Promise<number> {
    return AuthUserModel.countDocuments();
  }

  async updateLastLoginAt(userId: string): Promise<void> {
    await AuthUserModel.findByIdAndUpdate(userId, {
      lastLoginAt: new Date()
    });
  }

  async setResetPasswordToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date
  ): Promise<void> {
    await AuthUserModel.findByIdAndUpdate(userId, {
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: expiresAt
    });
  }

  async findByResetPasswordTokenHash(tokenHash: string): Promise<AuthUser | null> {
    const authUser = await AuthUserModel.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: {
        $gt: new Date()
      }
    });

    return authUser ? this.toDomain(authUser) : null;
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await AuthUserModel.findByIdAndUpdate(userId, {
      password: passwordHash
    });
  }

  async clearResetPasswordToken(userId: string): Promise<void> {
    await AuthUserModel.findByIdAndUpdate(userId, {
      resetPasswordTokenHash: null,
      resetPasswordExpiresAt: null
    });
  }

  private toDomain(authUser: HydratedDocument<AuthUserModelShape>): AuthUser {
    return {
      id: authUser._id.toString(),
      name: authUser.name,
      email: authUser.email,
      passwordHash: authUser.password,
      role: authUser.role,
      resetPasswordTokenHash: authUser.resetPasswordTokenHash,
      resetPasswordExpiresAt: authUser.resetPasswordExpiresAt,
      lastLoginAt: authUser.lastLoginAt,
      createdAt: authUser.createdAt,
      updatedAt: authUser.updatedAt
    };
  }
}
