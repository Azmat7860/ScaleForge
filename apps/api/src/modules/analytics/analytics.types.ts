import { ActivityLog } from "../activity/activity.types";
import { AuthRole } from "../auth/auth.types";

export type RoleDistributionItem = {
  role: AuthRole;
  count: number;
};

export type DailyRegistrationPoint = {
  date: string;
  count: number;
};

export type NotificationDeliveryStats = {
  queued: number;
  sent: number;
  failed: number;
};

export type AdminAnalyticsOverview = {
  summary: {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    managerUsers: number;
    memberUsers: number;
    queuedNotifications: number;
    sentNotifications: number;
    failedNotifications: number;
  };
  roles: RoleDistributionItem[];
  dailyRegistrations: DailyRegistrationPoint[];
  notificationDelivery: NotificationDeliveryStats;
  recentActivities: ActivityLog[];
};
