import { DatePipe } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { AppNotification } from "../../core/models/dashboard.models";

@Component({
  selector: "sf-notification-list",
  standalone: true,
  imports: [DatePipe],
  template: `
    <section class="panel">
      <header class="panel-header">
        <div>
          <p class="eyebrow">Notifications</p>
          <h3>{{ title() }}</h3>
        </div>

        <div class="summary-row">
          <span class="summary-chip">{{ unreadCount() }} unread</span>
          <span class="summary-chip accent">{{ queuedCount() }} queued</span>
        </div>
      </header>

      @if (notifications().length === 0) {
        <p class="empty-state">No notifications yet. Queue activity will appear here.</p>
      } @else {
        <div class="notification-list">
          @for (notification of notifications(); track notification.id) {
            <article class="notification-card" [class.unread]="!notification.readAt">
              <div class="notification-copy">
                <div class="notification-meta">
                  <strong>{{ notification.title }}</strong>
                  <span class="status-pill" [class]="notification.status">
                    {{ notification.status }}
                  </span>
                </div>
                <p>{{ notification.message }}</p>
                <small>
                  {{ notification.createdAt | date: "medium" }}
                </small>
              </div>

              @if (!notification.readAt) {
                <button type="button" class="ghost-button" (click)="markRead.emit(notification.id)">
                  Mark read
                </button>
              }
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .panel {
        padding: 1.35rem;
        border-radius: 1.4rem;
        background: var(--surface);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-soft);
      }
      .panel-header,
      .notification-meta {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }
      .panel-header {
        align-items: start;
        margin-bottom: 1rem;
      }
      .eyebrow {
        margin: 0 0 0.35rem;
        color: var(--accent-strong);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.72rem;
        font-weight: 800;
      }
      h3,
      p,
      small {
        margin: 0;
      }
      .summary-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
      }
      .summary-chip,
      .status-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        padding: 0.45rem 0.75rem;
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: capitalize;
        background: rgba(15, 118, 110, 0.08);
        color: var(--accent-strong);
      }
      .summary-chip.accent {
        background: rgba(180, 83, 9, 0.1);
        color: #9a3412;
      }
      .status-pill.sent {
        background: rgba(22, 163, 74, 0.12);
        color: #166534;
      }
      .status-pill.queued {
        background: rgba(217, 119, 6, 0.12);
        color: #92400e;
      }
      .status-pill.failed {
        background: rgba(220, 38, 38, 0.12);
        color: #991b1b;
      }
      .notification-list {
        display: grid;
        gap: 0.9rem;
      }
      .notification-card {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
        border-radius: 1rem;
        background: var(--surface-muted);
        border: 1px solid rgba(148, 163, 184, 0.18);
      }
      .notification-card.unread {
        border-color: rgba(15, 118, 110, 0.25);
        box-shadow: inset 0 0 0 1px rgba(15, 118, 110, 0.08);
      }
      .notification-copy {
        display: grid;
        gap: 0.5rem;
      }
      p {
        color: var(--text-muted);
      }
      small {
        color: var(--text-subtle);
      }
      .ghost-button {
        align-self: start;
      }
      .empty-state {
        color: var(--text-muted);
      }
      @media (max-width: 720px) {
        .notification-card,
        .panel-header,
        .notification-meta {
          flex-direction: column;
          align-items: start;
        }
      }
    `
  ]
})
export class NotificationListComponent {
  readonly title = input("Notification Center");
  readonly notifications = input.required<AppNotification[]>();
  readonly unreadCount = input(0);
  readonly queuedCount = input(0);
  readonly markRead = output<string>();
}
