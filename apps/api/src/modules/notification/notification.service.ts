import { NOT_FOUND } from "../../constants/http-status";
import { ApiError } from "../../utils/api-error";
import {
  GetNotificationsQueryDto,
  Notification,
  NotificationListResponse
} from "./notification.types";
import { INotificationRepository, INotificationService } from "./notification.interface";

export class NotificationService implements INotificationService {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  async createWelcomeEmailNotification(userId: string): Promise<Notification> {
    return this.notificationRepository.create({
      userId,
      title: "Welcome email queued",
      message: "Your welcome email has been queued for delivery.",
      kind: "welcome-email",
      channel: "email",
      status: "queued",
      metadata: {
        source: "signup-flow"
      },
      readAt: null
    });
  }

  async getMyNotifications(
    userId: string,
    query: GetNotificationsQueryDto
  ): Promise<NotificationListResponse> {
    const [items, unreadCount, queuedCount] = await Promise.all([
      this.notificationRepository.findByUserId(userId, query.limit),
      this.notificationRepository.countUnreadByUserId(userId),
      this.notificationRepository.countByUserIdAndStatus(userId, "queued")
    ]);

    return {
      items,
      unreadCount,
      queuedCount
    };
  }

  async markAsRead(userId: string, notificationId: string): Promise<Notification> {
    const notification = await this.notificationRepository.markAsRead(
      userId,
      notificationId
    );

    if (!notification) {
      throw new ApiError(NOT_FOUND, "Notification not found");
    }

    return notification;
  }

  async markAsSent(notificationId: string): Promise<void> {
    await this.notificationRepository.updateStatus(notificationId, "sent", {
      deliveredAt: new Date().toISOString()
    });
  }

  async markAsFailed(notificationId: string, reason: string): Promise<void> {
    await this.notificationRepository.updateStatus(notificationId, "failed", {
      failedAt: new Date().toISOString(),
      reason
    });
  }
}
