import { Component, computed, inject, signal } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AuthService } from "../core/services/auth.service";
import { EngagementService } from "../core/services/engagement.service";
import { NotificationListComponent } from "../shared/components/notification-list.component";

@Component({
  selector: "sf-dashboard-layout",
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NotificationListComponent
  ],
  template: `
    <div class="dashboard-shell">
      <aside class="sidebar" [class.sidebar-open]="sidebarOpen()">
        <div class="sidebar-main">
          <div class="brand-row">
            <div class="brand-mark">SF</div>
            <div>
              <p class="brand-kicker">ScaleForge</p>
              <h2>Admin Portal</h2>
            </div>
          </div>

          <nav>
            @for (link of navigationLinks(); track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="active-link"
                class="nav-link"
                (click)="closeSidebar()"
              >
                {{ link.label }}
              </a>
            }
          </nav>
        </div>

        <button class="logout-button" type="button" (click)="logout()">
          Logout
        </button>
      </aside>

      <div class="content-shell">
        <header class="topbar">
          <div class="topbar-main">
            <button
              type="button"
              class="menu-button"
              (click)="toggleSidebar()"
            >
              Menu
            </button>
            <div>
              <p class="topbar-label">Signed in as</p>
              <strong>{{ authService.currentUser()?.name }}</strong>
            </div>
          </div>

          <div class="topbar-actions">
            <button
              type="button"
              class="notification-pill"
              [attr.aria-expanded]="notificationPanelOpen()"
              (click)="toggleNotifications()"
            >
              <span class="notification-dot"></span>
              {{ engagementService.unreadCount() }} unread
            </button>

            <span class="user-pill">
              {{ authService.currentUser()?.name }}
              <span class="user-pill-role">{{ roleLabel() }}</span>
            </span>
          </div>

          @if (notificationPanelOpen()) {
            <div class="notification-panel">
              <sf-notification-list
                title="Recent notifications"
                [notifications]="engagementService.notifications()"
                [unreadCount]="engagementService.unreadCount()"
                [queuedCount]="engagementService.queuedCount()"
                (markRead)="markNotificationRead($event)"
              />
            </div>
          }

          <div
            class="notification-panel-backdrop"
            [class.visible]="notificationPanelOpen()"
            (click)="closeNotifications()"
          ></div>
        </header>

        <main class="page-content" (click)="closeNotifications()">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-shell {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 300px 1fr;
        align-items: start;
        background:
          radial-gradient(circle at top left, rgba(15, 118, 110, 0.12), transparent 22%),
          radial-gradient(circle at bottom right, rgba(180, 83, 9, 0.12), transparent 20%),
          var(--app-background);
      }
      .sidebar {
        position: sticky;
        top: 0;
        align-self: start;
        height: 100vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.75rem;
        background:
          radial-gradient(circle at top left, rgba(15, 118, 110, 0.18), transparent 26%),
          linear-gradient(180deg, #081c1a 0%, #0d2b28 55%, #103633 100%);
        color: #fff;
        border-right: 1px solid rgba(148, 163, 184, 0.14);
      }
      .sidebar-main {
        display: grid;
        gap: 2rem;
      }
      .brand-row {
        display: flex;
        align-items: center;
        gap: 0.95rem;
      }
      .brand-mark {
        width: 2.9rem;
        height: 2.9rem;
        display: grid;
        place-items: center;
        border-radius: 1rem;
        background: linear-gradient(135deg, #0f766e, #c2410c);
        font-weight: 800;
        letter-spacing: 0.08em;
      }
      .brand-kicker {
        margin: 0;
        color: #9dc5bf;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.75rem;
      }
      h2 {
        margin: 0.25rem 0 0;
      }
      nav {
        display: grid;
        gap: 0.45rem;
      }
      .nav-link,
      .logout-button {
        padding: 0.95rem 1rem;
        border-radius: 1rem;
        color: #dff5ee;
        background: transparent;
        text-decoration: none;
        border: none;
        text-align: left;
        cursor: pointer;
        transition:
          transform 160ms ease,
          background 160ms ease,
          color 160ms ease;
      }
      .nav-link:hover,
      .logout-button:hover,
      .active-link {
        background: rgba(15, 118, 110, 0.26);
        color: #fff;
        transform: translateX(2px);
      }
      .logout-button {
        margin-top: auto;
      }
      .content-shell {
        display: flex;
        flex-direction: column;
        min-width: 0;
        min-height: 100vh;
      }
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 1.1rem 1.5rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.16);
        background: rgba(255, 255, 255, 0.78);
        backdrop-filter: blur(22px);
        position: sticky;
        top: 0;
        z-index: 10;
      }
      .topbar-main,
      .topbar-actions {
        display: flex;
        align-items: center;
        gap: 0.9rem;
      }
      .topbar-label {
        margin: 0 0 0.2rem;
        color: var(--text-muted);
        font-size: 0.85rem;
      }
      .notification-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.55rem 0.95rem;
        border-radius: 999px;
        background: rgba(15, 118, 110, 0.08);
        color: var(--text-primary);
        font-weight: 700;
        border: 1px solid rgba(15, 118, 110, 0.14);
        box-shadow: none;
      }
      .notification-pill:hover {
        box-shadow: none;
      }
      .notification-dot {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--accent-color), var(--accent-warm));
      }
      .user-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.55rem 0.95rem;
        border-radius: 999px;
        background: rgba(15, 118, 110, 0.12);
        color: var(--accent-strong);
        font-weight: 700;
      }
      .user-pill-role {
        padding-left: 0.5rem;
        border-left: 1px solid rgba(15, 118, 110, 0.18);
        text-transform: capitalize;
      }
      .notification-panel {
        position: absolute;
        top: calc(100% + 0.65rem);
        right: 1.5rem;
        width: min(460px, calc(100vw - 2rem));
        z-index: 12;
      }
      .notification-panel-backdrop {
        position: fixed;
        inset: 0;
        z-index: 11;
        display: none;
      }
      .notification-panel-backdrop.visible {
        display: block;
      }
      .menu-button {
        display: none;
      }
      .page-content {
        padding: 1.5rem;
      }
      @media (max-width: 960px) {
        .dashboard-shell {
          grid-template-columns: 1fr;
        }
        .sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          width: min(300px, 86vw);
          height: 100vh;
          transform: translateX(-102%);
          transition: transform 180ms ease;
          z-index: 20;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.34);
        }
        .sidebar.sidebar-open {
          transform: translateX(0);
        }
        .menu-button {
          display: inline-flex;
        }
        .topbar {
          align-items: start;
          flex-direction: column;
        }
        .topbar-main,
        .topbar-actions {
          width: 100%;
          justify-content: space-between;
        }
        .notification-panel {
          right: 1rem;
          left: 1rem;
          width: auto;
        }
      }
      @media (max-width: 640px) {
        .page-content {
          padding: 1rem;
        }
        .topbar-main,
        .topbar-actions {
          flex-direction: column;
          align-items: start;
        }
      }
    `
  ]
})
export class DashboardLayoutComponent {
  readonly authService = inject(AuthService);
  readonly engagementService = inject(EngagementService);
  readonly sidebarOpen = signal(false);
  readonly notificationPanelOpen = signal(false);
  readonly roleLabel = computed(
    () => this.authService.currentUser()?.role ?? "user"
  );

  readonly navigationLinks = computed(() => {
    const baseLinks = [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Profile", path: "/profile" },
      { label: "Settings", path: "/settings" }
    ];

    if (this.authService.isManager()) {
      baseLinks.push({ label: "Users", path: "/users" });
    }

    if (this.authService.isAdmin()) {
      baseLinks.push(
        { label: "Analytics", path: "/admin/analytics" },
        { label: "User Management", path: "/admin/users" },
        { label: "Role Management", path: "/admin/roles" }
      );
    }

    return baseLinks;
  });

  constructor() {
    this.engagementService.loadNotifications().subscribe({
      error: () => undefined
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  toggleNotifications(): void {
    this.notificationPanelOpen.update((value) => !value);
  }

  closeNotifications(): void {
    this.notificationPanelOpen.set(false);
  }

  markNotificationRead(notificationId: string): void {
    this.engagementService.markNotificationRead(notificationId).subscribe({
      next: () => undefined
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
