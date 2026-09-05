import { Model, Schema, Types, model, models } from "mongoose";
import {
  NotificationChannel,
  NotificationKind,
  NotificationStatus
} from "./notification.types";

export type NotificationModelShape = {
  userId: Types.ObjectId;
  title: string;
  message: string;
  kind: NotificationKind;
  channel: NotificationChannel;
  status: NotificationStatus;
  readAt?: Date | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

const notificationSchema = new Schema<NotificationModelShape>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    kind: {
      type: String,
      enum: ["welcome-email"],
      required: true
    },
    channel: {
      type: String,
      enum: ["email"],
      required: true
    },
    status: {
      type: String,
      enum: ["queued", "sent", "failed"],
      default: "queued"
    },
    readAt: {
      type: Date,
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
    collection: "notifications"
  }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

const existingNotificationModel = models.Notification as
  | Model<NotificationModelShape>
  | undefined;

export const NotificationModel: Model<NotificationModelShape> =
  existingNotificationModel ??
  model<NotificationModelShape>("Notification", notificationSchema);
