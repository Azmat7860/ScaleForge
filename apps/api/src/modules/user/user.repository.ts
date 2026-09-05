import bcrypt from "bcryptjs";
import { IUserRepository } from "./user.interface";
import {
  CreateUserInput,
  GetUsersQueryDto,
  UpdateProfileDto,
  UpdateUserDto,
  User,
  UserStats
} from "./user.types";
import { AuthUserModel } from "../auth/auth.model";
import { env } from "../../config/env";
import { NotificationModel } from "../notification/notification.model";

export class UserRepository implements IUserRepository {
  async findAll(
    query: GetUsersQueryDto
  ): Promise<{ items: User[]; total: number }> {
    const filters: Record<string, unknown> = {};

    if (query.search) {
      filters.$or = [
        {
          name: {
            $regex: query.search,
            $options: "i"
          }
        },
        {
          email: {
            $regex: query.search,
            $options: "i"
          }
        }
      ];
    }

    if (query.role && query.role !== "all") {
      filters.role = query.role;
    }

    const skip = (query.page - 1) * query.limit;
    const [authUsers, total] = await Promise.all([
      AuthUserModel.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit),
      AuthUserModel.countDocuments(filters)
    ]);

    return {
      items: authUsers.map((authUser) => ({
        id: authUser._id.toString(),
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
        createdAt: authUser.createdAt,
        lastLoginAt: authUser.lastLoginAt
      })),
      total
    };
  }

  async findById(id: string): Promise<User | null> {
    const authUser = await AuthUserModel.findById(id);

    if (!authUser) {
      return null;
    }

    return {
      id: authUser._id.toString(),
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      createdAt: authUser.createdAt,
      lastLoginAt: authUser.lastLoginAt
    };
  }

  async create(input: CreateUserInput): Promise<User> {
    const passwordHash = await bcrypt.hash(
      input.password,
      env.BCRYPT_SALT_ROUNDS
    );

    const authUser = await AuthUserModel.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: passwordHash,
      role: input.role ?? "user"
    });

    return {
      id: authUser._id.toString(),
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      createdAt: authUser.createdAt,
      lastLoginAt: authUser.lastLoginAt
    };
  }

  async updateProfile(userId: string, input: UpdateProfileDto): Promise<User | null> {
    const authUser = await AuthUserModel.findByIdAndUpdate(
      userId,
      {
        name: input.name,
        email: input.email.toLowerCase()
      },
      { new: true }
    );

    if (!authUser) {
      return null;
    }

    return {
      id: authUser._id.toString(),
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      createdAt: authUser.createdAt,
      lastLoginAt: authUser.lastLoginAt
    };
  }

  async updateUser(userId: string, input: UpdateUserDto): Promise<User | null> {
    const authUser = await AuthUserModel.findByIdAndUpdate(
      userId,
      {
        name: input.name,
        email: input.email.toLowerCase(),
        role: input.role
      },
      { new: true }
    );

    if (!authUser) {
      return null;
    }

    return {
      id: authUser._id.toString(),
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      createdAt: authUser.createdAt,
      lastLoginAt: authUser.lastLoginAt
    };
  }

  async updateRole(
    userId: string,
    role: User["role"]
  ): Promise<User | null> {
    const authUser = await AuthUserModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!authUser) {
      return null;
    }

    return {
      id: authUser._id.toString(),
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      createdAt: authUser.createdAt,
      lastLoginAt: authUser.lastLoginAt
    };
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await AuthUserModel.findByIdAndUpdate(userId, {
      password: passwordHash
    });
  }

  async deleteById(userId: string): Promise<boolean> {
    const deletedUser = await AuthUserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return false;
    }

    await NotificationModel.deleteMany({
      userId: deletedUser._id
    });

    return true;
  }

  async getStats(): Promise<UserStats> {
    const [totalUsers, adminUsers, managerUsers, activeUsers, queuedNotifications] =
      await Promise.all([
        AuthUserModel.countDocuments(),
        AuthUserModel.countDocuments({ role: "admin" }),
        AuthUserModel.countDocuments({ role: "manager" }),
        AuthUserModel.countDocuments({
          lastLoginAt: {
            $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
          }
        }),
        NotificationModel.countDocuments({ status: "queued" })
      ]);

    const userCount = totalUsers - adminUsers - managerUsers;

    return {
      totalUsers,
      activeUsers,
      queuedNotifications,
      roleStatistics: {
        admin: adminUsers,
        manager: managerUsers,
        user: Math.max(0, userCount)
      }
    };
  }
}
