import { Component, computed, inject } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";
import { EngagementService } from "../../../core/services/engagement.service";
import { UserService } from "../../../core/services/user.service";
import { ActivityFeedComponent } from "../../../shared/components/activity-feed.component";
import { LoaderComponent } from "../../../shared/components/loader.component";
import { NotificationListComponent } from "../../../shared/components/notification-list.component";
import { PageHeaderComponent } from "../../../shared/components/page-header.component";
import { StatCardComponent } from "../../../shared/components/stat-card.component";

@Component({
  selector: "sf-dashboard-page",
  standalone: true,
  imports: [
    ActivityFeedComponent,
    LoaderComponent,
    NotificationListComponent,
    PageHeaderComponent,
    StatCardComponent
  ],
  template: `
    <sf-page-header
      title="Dashboard"
      subtitle="A polished command center for user growth, queue health, and account activity."
    />

    <sf-loader [loading]="dashboardLoading()" label="Loading dashboard insights..." />

    <section class="hero-card">
      <div>
        <p class="hero-kicker">ScaleForge SaaS Operations</p>
        <h2>Everything important is visible at a glance.</h2>
        <p class="hero-copy">
          Monitor users, watch background email delivery, and review account activity without leaving the dashboard.
        </p>
      </div>
      <div class="hero-badges">
        <span class="hero-badge">MongoDB</span>
        <span class="hero-badge">Redis</span>
        <span class="hero-badge">BullMQ</span>
        <span class="hero-badge">RBAC</span>
      </div>
    </section>

    <section class="stats-grid">
      <sf-stat-card label="Total Users" [value]="totalUsers()" hint="Mongo-backed user records" />
      <sf-stat-card label="Active Users" [value]="activeUsers()" hint="Signed in within the last 30 days" />
      <sf-stat-card label="Queued Emails" [value]="queuedEmails()" hint="Background welcome emails waiting in queue" />
      <sf-stat-card label="Current Role" [value]="roleLabel()" hint="RBAC-aware signed in session" />
    </section>

    <section class="stats-grid secondary-grid">
      <sf-stat-card label="Admins" [value]="adminCount()" hint="Full access operators" />
      <sf-stat-card label="Managers" [value]="managerCount()" hint="Operational access" />
      <sf-stat-card label="Users" [value]="userCount()" hint="Workspace members" />
    </section>

    <section class="insights-grid">
      <sf-notification-list
        [notifications]="engagementService.notifications()"
        [unreadCount]="engagementService.unreadCount()"
        [queuedCount]="engagementService.queuedCount()"
        (markRead)="markNotificationRead($event)"
      />

      <sf-activity-feed
        title="Your activity log"
        [activities]="engagementService.activities()"
      />
    </section>
  `,
  styles: [
    `
      .hero-card {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 1.5rem;
        align-items: center;
        margin-bottom: 1.25rem;
        padding: 1.5rem;
        border-radius: 1.5rem;
        background:
          linear-gradient(135deg, rgba(15, 118, 110, 0.14), rgba(255, 255, 255, 0.92)),
          white;
        border: 1px solid rgba(15, 118, 110, 0.14);
        box-shadow: var(--shadow-soft);
      }
      .hero-kicker {
        margin: 0 0 0.45rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.75rem;
        color: var(--accent-strong);
        font-weight: 800;
      }
      h2,
      .hero-copy {
        margin: 0;
      }
      h2 {
        font-size: clamp(1.9rem, 4vw, 2.8rem);
      }
      .hero-copy {
        margin-top: 0.8rem;
        max-width: 42rem;
        color: var(--text-muted);
        line-height: 1.65;
      }
      .hero-badges {
        display: flex;
        flex-wrap: wrap;
        justify-content: end;
        gap: 0.75rem;
      }
      .hero-badge {
        padding: 0.8rem 1rem;
        border-radius: 1rem;
        background: rgba(15, 23, 42, 0.92);
        color: white;
        font-weight: 700;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
      }
      .secondary-grid {
        margin-top: 1rem;
      }
      .insights-grid {
        display: grid;
        grid-template-columns: 1.05fr 1fr;
        gap: 1rem;
        margin-top: 1rem;
      }
      @media (max-width: 1100px) {
        .stats-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .hero-card,
        .insights-grid {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 720px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
        .hero-badges {
          justify-content: start;
        }
      }
    `
  ]
})
export class DashboardPage {
  readonly authService = inject(AuthService);
  readonly engagementService = inject(EngagementService);
  readonly userService = inject(UserService);
  readonly dashboardLoading = computed(
    () =>
      this.userService.loading() ||
      this.engagementService.notificationsLoading() ||
      this.engagementService.activitiesLoading()
  );
  readonly roleLabel = computed(() => this.authService.currentUser()?.role ?? "guest");
  readonly totalUsers = computed(
    () => String(this.userService.stats()?.totalUsers ?? 0)
  );
  readonly activeUsers = computed(
    () => String(this.userService.stats()?.activeUsers ?? 0)
  );
  readonly adminCount = computed(
    () => String(this.userService.stats()?.roleStatistics.admin ?? 0)
  );
  readonly managerCount = computed(
    () => String(this.userService.stats()?.roleStatistics.manager ?? 0)
  );
  readonly userCount = computed(
    () => String(this.userService.stats()?.roleStatistics.user ?? 0)
  );
  readonly queuedEmails = computed(
    () => String(this.userService.stats()?.queuedNotifications ?? 0)
  );

  constructor() {
    this.userService.loadStats().subscribe();
    this.engagementService.loadNotifications().subscribe();
    this.engagementService.loadMyActivities().subscribe();
  }

  markNotificationRead(notificationId: string): void {
    this.engagementService.markNotificationRead(notificationId).subscribe();
  }
}
