import { ActivityLogModel } from "../activity/activity.model";
import { AuthUserModel } from "../auth/auth.model";
import { NotificationModel } from "../notification/notification.model";
import { IAnalyticsRepository } from "./analytics.interface";
import { AdminAnalyticsOverview, DailyRegistrationPoint } from "./analytics.types";

export class AnalyticsRepository implements IAnalyticsRepository {
  async getAdminOverview(days: number): Promise<AdminAnalyticsOverview> {
    const [totalUsers, adminUsers, managerUsers, activeUsers] =
      await Promise.all([
        AuthUserModel.countDocuments(),
        AuthUserModel.countDocuments({ role: "admin" }),
        AuthUserModel.countDocuments({ role: "manager" }),
        AuthUserModel.countDocuments({
          lastLoginAt: {
            $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
          }
        })
      ]);

    const [queuedNotifications, sentNotifications, failedNotifications] =
      await Promise.all([
        NotificationModel.countDocuments({ status: "queued" }),
        NotificationModel.countDocuments({ status: "sent" }),
        NotificationModel.countDocuments({ status: "failed" })
      ]);

    const recentActivities = await ActivityLogModel.find()
      .sort({ createdAt: -1 })
      .limit(8);

    const dailyRegistrations = await this.getDailyRegistrations(days);
    const memberUsers = Math.max(0, totalUsers - adminUsers - managerUsers);

    return {
      summary: {
        totalUsers,
        activeUsers,
        adminUsers,
        managerUsers,
        memberUsers,
        queuedNotifications,
        sentNotifications,
        failedNotifications
      },
      roles: [
        { role: "admin", count: adminUsers },
        { role: "manager", count: managerUsers },
        { role: "user", count: memberUsers }
      ],
      dailyRegistrations,
      notificationDelivery: {
        queued: queuedNotifications,
        sent: sentNotifications,
        failed: failedNotifications
      },
      recentActivities: recentActivities.map((activity) => ({
        id: activity._id.toString(),
        actorId: activity.actorId?.toHexString() ?? null,
        actorName: activity.actorName,
        actorEmail: activity.actorEmail,
        action: activity.action,
        description: activity.description,
        targetType: activity.targetType,
        targetId: activity.targetId,
        metadata: activity.metadata,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt
      }))
    };
  }

  private async getDailyRegistrations(days: number): Promise<DailyRegistrationPoint[]> {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (days - 1));

    const rawSeries = await AuthUserModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $match: {
          createdAt: {
            $gte: startDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);

    const mappedSeries = new Map(
      rawSeries.map((item) => [item._id, item.count] as const)
    );

    const filledSeries: DailyRegistrationPoint[] = [];

    for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + dayOffset);

      const isoDate = currentDate.toISOString().slice(0, 10);

      filledSeries.push({
        date: isoDate,
        count: mappedSeries.get(isoDate) ?? 0
      });
    }

    return filledSeries;
  }
}
