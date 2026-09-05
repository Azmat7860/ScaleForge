import { z } from "zod";
import {
  getNotificationsQuerySchema,
  markNotificationReadSchema
} from "./notification.validation";

export type NotificationStatus = "queued" | "sent" | "failed";

export type NotificationKind = "welcome-email";

export type NotificationChannel = "email";

export type NotificationMetadata = Record<string, unknown>;

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  kind: NotificationKind;
  channel: NotificationChannel;
  status: NotificationStatus;
  readAt?: Date | null;
  metadata?: NotificationMetadata;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateNotificationInput = Omit<
  Notification,
  "id" | "createdAt" | "updatedAt"
>;

export type GetNotificationsQueryDto = z.infer<
  typeof getNotificationsQuerySchema
>["query"];

export type MarkNotificationReadParamsDto = z.infer<
  typeof markNotificationReadSchema
>["params"];

export type NotificationListResponse = {
  items: Notification[];
  unreadCount: number;
  queuedCount: number;
};
