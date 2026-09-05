import { AuthRole } from "./auth.models";

export type NotificationStatus = "queued" | "sent" | "failed";

export type AppNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  kind: "welcome-email";
  channel: "email";
  status: NotificationStatus;
  readAt?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type NotificationFeed = {
  items: AppNotification[];
  unreadCount: number;
  queuedCount: number;
};

export type ActivityAction =
  | "user-signed-up"
  | "user-logged-in"
  | "password-changed"
  | "profile-updated"
  | "password-reset-requested"
  | "password-reset-completed"
  | "user-created"
  | "role-updated"
  | "welcome-email-sent"
  | "welcome-email-failed";

export type ActivityLog = {
  id: string;
  actorId?: string | null;
  actorName?: string | null;
  actorEmail?: string | null;
  action: ActivityAction;
  description: string;
  targetType: "user" | "auth" | "notification" | "system";
  targetId?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

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
