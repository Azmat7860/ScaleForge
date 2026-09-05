import { Component, input, output } from "@angular/core";

@Component({
  selector: "sf-modal",
  standalone: true,
  template: `
    @if (open()) {
      <div class="modal-backdrop" (click)="closed.emit()">
        <section class="modal-panel" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <div>
              <p class="eyebrow">{{ eyebrow() }}</p>
              <h3>{{ title() }}</h3>
            </div>

            <button type="button" (click)="closed.emit()">Close</button>
          </header>

          <div class="modal-body">
            <ng-content />
          </div>
        </section>
      </div>
    }
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 1rem;
        background: rgba(10, 17, 40, 0.52);
        backdrop-filter: blur(10px);
      }
      .modal-panel {
        width: min(560px, 100%);
        padding: 1.25rem;
        border-radius: 1.2rem;
        background: var(--surface);
        border: 1px solid var(--border-color);
        box-shadow: 0 24px 60px rgba(9, 17, 43, 0.25);
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .eyebrow {
        margin: 0;
        color: var(--accent-strong);
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.12em;
      }
      h3 {
        margin: 0.25rem 0 0;
      }
      button {
        border: none;
        background: transparent;
        color: var(--text-muted);
        cursor: pointer;
      }
    `
  ]
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly eyebrow = input("ScaleForge");
  readonly closed = output<void>();
}
