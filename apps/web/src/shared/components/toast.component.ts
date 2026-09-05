import { Component, inject } from "@angular/core";
import { ToastService } from "../../core/services/toast.service";

@Component({
  selector: "sf-toast-host",
  standalone: true,
  template: `
    <div class="toast-shell">
      @for (toast of toastService.toasts(); track toast.id) {
        <article class="toast" [class.success]="toast.tone === 'success'" [class.error]="toast.tone === 'error'">
          <p>{{ toast.message }}</p>
          <button type="button" (click)="toastService.remove(toast.id)">x</button>
        </article>
      }
    </div>
  `,
  styles: [
    `
      .toast-shell {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        display: grid;
        gap: 0.75rem;
      }
      .toast {
        min-width: 260px;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
        padding: 0.9rem 1rem;
        border-radius: 1rem;
        background: #18243b;
        color: white;
        box-shadow: 0 16px 40px rgba(10, 17, 40, 0.28);
      }
      .toast.success {
        background: #166534;
      }
      .toast.error {
        background: #b91c1c;
      }
      .toast:not(.success):not(.error) {
        background: #115e59;
      }
      p {
        margin: 0;
      }
      button {
        border: none;
        background: transparent;
        color: inherit;
        cursor: pointer;
      }
    `
  ]
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
