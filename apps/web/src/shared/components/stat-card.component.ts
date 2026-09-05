import { Component, input } from "@angular/core";

@Component({
  selector: "sf-stat-card",
  standalone: true,
  template: `
    <article class="stat-card">
      <p class="label">{{ label() }}</p>
      <h3>{{ value() }}</h3>
      <p class="hint">{{ hint() }}</p>
    </article>
  `,
  styles: [
    `
      .stat-card {
        padding: 1.25rem;
        border-radius: 1.2rem;
        background:
          linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(246, 251, 249, 0.96));
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-soft);
      }
      .label,
      .hint {
        margin: 0;
        color: var(--text-muted);
      }
      h3 {
        margin: 0.5rem 0;
        font-size: 2rem;
        color: var(--text-primary);
      }
    `
  ]
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly hint = input("");
}
