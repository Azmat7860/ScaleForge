import { HydratedDocument, Types } from "mongoose";
import { INotificationRepository } from "./notification.interface";
import { NotificationModel, NotificationModelShape } from "./notification.model";
import { CreateNotificationInput, Notification } from "./notification.types";

export class NotificationRepository implements INotificationRepository {
  async create(input: CreateNotificationInput): Promise<Notification> {
    const notification = await NotificationModel.create({
      userId: new Types.ObjectId(input.userId),
      title: input.title,
      message: input.message,
      kind: input.kind,
      channel: input.channel,
      status: input.status,
      readAt: input.readAt ?? null,
      metadata: input.metadata ?? {}
    });

    return this.toDomain(notification);
  }

  async findByUserId(userId: string, limit: number): Promise<Notification[]> {
    const notifications = await NotificationModel.find({
      userId: new Types.ObjectId(userId)
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    return notifications.map((notification) => this.toDomain(notification));
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    return NotificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      readAt: null
    });
  }

  async countByUserIdAndStatus(
    userId: string,
    status: Notification["status"]
  ): Promise<number> {
    return NotificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      status
    });
  }

  async updateStatus(
    notificationId: string,
    status: Notification["status"],
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await NotificationModel.findByIdAndUpdate(notificationId, {
      status,
      ...(metadata ? { metadata } : {})
    });
  }

  async markAsRead(
    userId: string,
    notificationId: string
  ): Promise<Notification | null> {
    const notification = await NotificationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        userId: new Types.ObjectId(userId)
      },
      {
        readAt: new Date()
      },
      { new: true }
    );

    return notification ? this.toDomain(notification) : null;
  }

  private toDomain(
    notification: HydratedDocument<NotificationModelShape>
  ): Notification {
    return {
      id: notification._id.toString(),
      userId: notification.userId.toHexString(),
      title: notification.title,
      message: notification.message,
      kind: notification.kind,
      channel: notification.channel,
      status: notification.status,
      readAt: notification.readAt,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt
    };
  }
}
