import { Component, input } from "@angular/core";

@Component({
  selector: "sf-loader",
  standalone: true,
  template: `
    @if (loading()) {
      <div class="loader-shell">
        <div class="spinner"></div>
        <p>{{ label() }}</p>
      </div>
    }
  `,
  styles: [
    `
      .loader-shell {
        display: grid;
        place-items: center;
        gap: 0.85rem;
        padding: 2rem;
      }
      .spinner {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        border: 3px solid rgba(15, 118, 110, 0.14);
        border-top-color: var(--accent-color);
        animation: spin 0.9s linear infinite;
      }
      p {
        margin: 0;
        color: var(--text-muted);
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `
  ]
})
export class LoaderComponent {
  readonly loading = input(false);
  readonly label = input("Loading...");
}
