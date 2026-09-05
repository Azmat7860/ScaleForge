import { DatePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { ActivityLog } from "../../core/models/dashboard.models";

@Component({
  selector: "sf-activity-feed",
  standalone: true,
  imports: [DatePipe],
  template: `
    <section class="panel">
      <header class="panel-header">
        <div>
          <p class="eyebrow">Activity</p>
          <h3>{{ title() }}</h3>
        </div>
        <span class="count-pill">{{ activities().length }} events</span>
      </header>

      @if (activities().length === 0) {
        <p class="empty-state">Activity will appear here after login, profile updates, and password changes.</p>
      } @else {
        <div class="timeline">
          @for (activity of activities(); track activity.id) {
            <article class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <strong>{{ activity.description }}</strong>
                  <span>{{ activity.createdAt | date: "short" }}</span>
                </div>
                <p>
                  {{ activity.actorName || activity.actorEmail || "System" }}
                  ·
                  {{ activity.action }}
                </p>
              </div>
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
      .timeline-header {
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
      p {
        margin: 0;
      }
      .count-pill {
        border-radius: 999px;
        padding: 0.45rem 0.75rem;
        font-size: 0.78rem;
        font-weight: 700;
        background: rgba(15, 118, 110, 0.08);
        color: var(--accent-strong);
      }
      .timeline {
        display: grid;
        gap: 1rem;
      }
      .timeline-item {
        display: grid;
        grid-template-columns: 14px 1fr;
        gap: 0.9rem;
      }
      .timeline-marker {
        width: 14px;
        height: 14px;
        margin-top: 0.35rem;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--accent-color), var(--accent-warm));
        box-shadow: 0 0 0 6px rgba(15, 118, 110, 0.08);
      }
      .timeline-content {
        display: grid;
        gap: 0.4rem;
        padding: 0.15rem 0 0.95rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      }
      .timeline-content p,
      .timeline-header span,
      .empty-state {
        color: var(--text-muted);
      }
      @media (max-width: 720px) {
        .panel-header,
        .timeline-header {
          flex-direction: column;
          align-items: start;
        }
      }
    `
  ]
})
export class ActivityFeedComponent {
  readonly title = input("Recent activity");
  readonly activities = input.required<ActivityLog[]>();
}
