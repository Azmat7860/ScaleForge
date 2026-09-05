import { Component, input } from "@angular/core";

@Component({
  selector: "sf-page-header",
  standalone: true,
  template: `
    <div class="page-header">
      <div>
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h1>{{ title() }}</h1>
      </div>
      <p class="subtitle">{{ subtitle() }}</p>
    </div>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .eyebrow {
        margin: 0 0 0.25rem;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--accent-strong);
      }
      h1 {
        margin: 0;
        font-size: clamp(1.8rem, 3vw, 2.6rem);
      }
      .subtitle {
        margin: 0;
        max-width: 32rem;
        color: var(--text-muted);
        line-height: 1.65;
      }
      @media (max-width: 800px) {
        .page-header {
          flex-direction: column;
          align-items: start;
        }
      }
    `
  ]
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input("");
  readonly eyebrow = input("ScaleForge");
}
