import { computed, inject, Injectable, signal } from "@angular/core";
import { finalize, map, Observable, tap } from "rxjs";
import {
  ActivityLog,
  AdminAnalyticsOverview,
  AppNotification,
  NotificationFeed
} from "../models/dashboard.models";
import { EngagementApiService } from "./engagement-api.service";

@Injectable({
  providedIn: "root"
})
export class EngagementService {
  private readonly engagementApiService = inject(EngagementApiService);

  readonly notificationFeed = signal<NotificationFeed | null>(null);
  readonly activities = signal<ActivityLog[]>([]);
  readonly adminOverview = signal<AdminAnalyticsOverview | null>(null);

  readonly notificationsLoading = signal(false);
  readonly activitiesLoading = signal(false);
  readonly analyticsLoading = signal(false);

  readonly notifications = computed(
    () => this.notificationFeed()?.items ?? []
  );
  readonly unreadCount = computed(
    () => this.notificationFeed()?.unreadCount ?? 0
  );
  readonly queuedCount = computed(
    () => this.notificationFeed()?.queuedCount ?? 0
  );

  loadNotifications(limit = 6): Observable<NotificationFeed> {
    this.notificationsLoading.set(true);

    return this.engagementApiService.getNotifications(limit).pipe(
      map((response) => response.data),
      tap((feed) => this.notificationFeed.set(feed)),
      finalize(() => this.notificationsLoading.set(false))
    );
  }

  markNotificationRead(notificationId: string): Observable<AppNotification> {
    return this.engagementApiService.markNotificationRead(notificationId).pipe(
      map((response) => response.data),
      tap((notification) => {
        const currentFeed = this.notificationFeed();

        if (!currentFeed) {
          return;
        }

        const hadUnread = currentFeed.items.some(
          (item) => item.id === notificationId && !item.readAt
        );

        this.notificationFeed.set({
          ...currentFeed,
          unreadCount: hadUnread
            ? Math.max(0, currentFeed.unreadCount - 1)
            : currentFeed.unreadCount,
          items: currentFeed.items.map((item) =>
            item.id === notificationId ? notification : item
          )
        });
      })
    );
  }

  loadMyActivities(limit = 8): Observable<ActivityLog[]> {
    this.activitiesLoading.set(true);

    return this.engagementApiService.getMyActivities(limit).pipe(
      map((response) => response.data),
      tap((activities) => this.activities.set(activities)),
      finalize(() => this.activitiesLoading.set(false))
    );
  }

  loadAdminOverview(days = 7): Observable<AdminAnalyticsOverview> {
    this.analyticsLoading.set(true);

    return this.engagementApiService.getAdminOverview(days).pipe(
      map((response) => response.data),
      tap((overview) => this.adminOverview.set(overview)),
      finalize(() => this.analyticsLoading.set(false))
    );
  }
}
