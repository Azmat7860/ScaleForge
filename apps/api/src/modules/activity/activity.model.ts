import { Model, Schema, Types, model, models } from "mongoose";
import { ActivityAction } from "./activity.types";

export type ActivityLogModelShape = {
  actorId?: Types.ObjectId | null;
  actorName?: string | null;
  actorEmail?: string | null;
  action: ActivityAction;
  description: string;
  targetType: "user" | "auth" | "notification" | "system";
  targetId?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

const activityLogSchema = new Schema<ActivityLogModelShape>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      default: null,
      index: true
    },
    actorName: {
      type: String,
      default: null
    },
    actorEmail: {
      type: String,
      default: null
    },
    action: {
      type: String,
      enum: [
        "user-signed-up",
        "user-logged-in",
        "password-changed",
        "profile-updated",
        "password-reset-requested",
        "password-reset-completed",
        "user-created",
        "role-updated",
        "welcome-email-sent",
        "welcome-email-failed"
      ],
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    targetType: {
      type: String,
      enum: ["user", "auth", "notification", "system"],
      required: true
    },
    targetId: {
      type: String,
      default: null
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "activity_logs"
  }
);

activityLogSchema.index({ createdAt: -1 });

const existingActivityLogModel = models.ActivityLog as
  | Model<ActivityLogModelShape>
  | undefined;

export const ActivityLogModel: Model<ActivityLogModelShape> =
  existingActivityLogModel ??
  model<ActivityLogModelShape>("ActivityLog", activityLogSchema);
