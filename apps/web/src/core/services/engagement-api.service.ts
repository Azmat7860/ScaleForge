import { Injectable } from "@angular/core";
import {
  ActivityLog,
  AdminAnalyticsOverview,
  AppNotification,
  NotificationFeed
} from "../models/dashboard.models";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root"
})
export class EngagementApiService extends ApiService {
  getNotifications(limit = 6) {
    return this.getWithQuery<NotificationFeed>("/notifications", { limit });
  }

  markNotificationRead(notificationId: string) {
    return this.patch<AppNotification, Record<string, never>>(
      `/notifications/${notificationId}/read`,
      {}
    );
  }

  getMyActivities(limit = 8) {
    return this.getWithQuery<ActivityLog[]>("/activities/me", { limit });
  }

  getAdminOverview(days = 7) {
    return this.getWithQuery<AdminAnalyticsOverview>("/analytics/overview", {
      days
    });
  }
}
