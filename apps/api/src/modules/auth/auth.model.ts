import { Model, Schema, model, models } from "mongoose";
import { AuthRole } from "./auth.types";

export type AuthUserModelShape = {
  name: string;
  email: string;
  password: string;
  role: AuthRole;
  resetPasswordTokenHash?: string | null;
  resetPasswordExpiresAt?: Date | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const authUserSchema = new Schema<AuthUserModelShape>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user"
    },
    resetPasswordTokenHash: {
      type: String,
      default: null
    },
    resetPasswordExpiresAt: {
      type: Date,
      default: null
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "users"
  }
);

authUserSchema.index({ email: 1 }, { unique: true });

const existingAuthUserModel = models.AuthUser as
  | Model<AuthUserModelShape>
  | undefined;

export const AuthUserModel: Model<AuthUserModelShape> =
  existingAuthUserModel ?? model<AuthUserModelShape>("AuthUser", authUserSchema);
