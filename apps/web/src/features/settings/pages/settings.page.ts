import { CommonModule } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { PreferencesService } from "../../../core/services/preferences.service";
import { ToastService } from "../../../core/services/toast.service";
import { PageHeaderComponent } from "../../../shared/components/page-header.component";

@Component({
  selector: "sf-settings-page",
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <sf-page-header
      title="Settings"
      subtitle="Account settings and UI preferences for a more complete authenticated experience."
    />

    <section class="settings-grid">
      <article class="settings-panel">
        <div class="panel-heading">
          <h3>Account Preferences</h3>
          <p>Control the communication style for your account.</p>
        </div>

        <button
          type="button"
          class="preference-row"
          (click)="toggle('emailNotifications')"
        >
          <span class="toggle-copy">
            <strong>Email notifications</strong>
            <small>Receive system alerts and account updates.</small>
          </span>
          <span class="toggle-switch" [class.on]="preferences().emailNotifications"></span>
        </button>

        <button
          type="button"
          class="preference-row"
          (click)="toggle('weeklyDigest')"
        >
          <span class="toggle-copy">
            <strong>Weekly digest</strong>
            <small>Get a weekly summary of activity and analytics.</small>
          </span>
          <span class="toggle-switch" [class.on]="preferences().weeklyDigest"></span>
        </button>
      </article>

      <article class="settings-panel">
        <div class="panel-heading">
          <h3>Workspace Preferences</h3>
          <p>Shape how the dashboard and admin workspace feel.</p>
        </div>

        <button
          type="button"
          class="preference-row"
          (click)="toggle('compactLayout')"
        >
          <span class="toggle-copy">
            <strong>Compact layout</strong>
            <small>Use a denser layout for dashboard and workspace pages.</small>
          </span>
          <span class="toggle-switch" [class.on]="preferences().compactLayout"></span>
        </button>

        <button
          type="button"
          class="preference-row"
          (click)="toggle('analyticsPins')"
        >
          <span class="toggle-copy">
            <strong>Pin analytics cards</strong>
            <small>Keep your analytics cards emphasized in the admin views.</small>
          </span>
          <span class="toggle-switch" [class.on]="preferences().analyticsPins"></span>
        </button>
      </article>
    </section>

    <button class="btn-primary save-button" type="button" (click)="savePreferences()">
      Save preferences
    </button>
  `,
  styles: [
    `
      .settings-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }
      .settings-panel {
        padding: 1.4rem;
        background: var(--surface);
        border-radius: 1.25rem;
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-soft);
      }
      .panel-heading {
        margin-bottom: 1rem;
      }
      .panel-heading h3,
      .panel-heading p {
        margin: 0;
      }
      .panel-heading p {
        margin-top: 0.45rem;
        color: var(--text-muted);
      }
      .preference-row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-top: 0.85rem;
        padding: 1rem;
        border-radius: 1rem;
        background: rgba(248, 250, 252, 0.92);
        border: 1px solid rgba(148, 163, 184, 0.16);
        color: var(--text-primary);
        box-shadow: none;
      }
      .preference-row:hover:not(:disabled) {
        transform: none;
        box-shadow: none;
      }
      .toggle-copy {
        display: grid;
        gap: 0.3rem;
        text-align: left;
      }
      .toggle-copy small {
        color: var(--text-muted);
      }
      .toggle-switch {
        position: relative;
        width: 3.2rem;
        height: 1.9rem;
        flex-shrink: 0;
        border-radius: 999px;
        background: #d9e1ea;
        transition: background 160ms ease;
      }
      .toggle-switch::after {
        content: "";
        position: absolute;
        top: 0.2rem;
        left: 0.2rem;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        background: white;
        box-shadow: 0 4px 10px rgba(15, 23, 42, 0.18);
        transition: transform 160ms ease;
      }
      .toggle-switch.on {
        background: linear-gradient(135deg, var(--accent-color), #0b5c66);
      }
      .toggle-switch.on::after {
        transform: translateX(1.3rem);
      }
      .save-button {
        margin-top: 1rem;
      }
      @media (max-width: 900px) {
        .settings-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class SettingsPage {
  private readonly preferencesService = inject(PreferencesService);
  readonly preferences = computed(() => this.preferencesService.preferences());

  constructor(private readonly toastService: ToastService) {}

  toggle(
    key:
      | "emailNotifications"
      | "weeklyDigest"
      | "compactLayout"
      | "analyticsPins"
  ): void {
    this.preferencesService.update({
      [key]: !this.preferences()[key]
    });
  }

  savePreferences(): void {
    this.preferencesService.save();
    this.toastService.success("Preferences saved successfully");
  }
}
