import {
  CreateNotificationInput,
  GetNotificationsQueryDto,
  Notification,
  NotificationListResponse
} from "./notification.types";

export interface INotificationRepository {
  create(input: CreateNotificationInput): Promise<Notification>;
  findByUserId(userId: string, limit: number): Promise<Notification[]>;
  countUnreadByUserId(userId: string): Promise<number>;
  countByUserIdAndStatus(
    userId: string,
    status: Notification["status"]
  ): Promise<number>;
  updateStatus(
    notificationId: string,
    status: Notification["status"],
    metadata?: Record<string, unknown>
  ): Promise<void>;
  markAsRead(userId: string, notificationId: string): Promise<Notification | null>;
}

export interface INotificationService {
  createWelcomeEmailNotification(userId: string): Promise<Notification>;
  getMyNotifications(
    userId: string,
    query: GetNotificationsQueryDto
  ): Promise<NotificationListResponse>;
  markAsRead(userId: string, notificationId: string): Promise<Notification>;
  markAsSent(notificationId: string): Promise<void>;
  markAsFailed(notificationId: string, reason: string): Promise<void>;
}
