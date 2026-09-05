import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthStoreService } from "./core/services/auth-store.service";
import { ToastComponent } from "./shared/components/toast.component";

@Component({
  selector: "sf-root",
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <sf-toast-host />

    @if (!authStore.initialized()) {
      <div class="boot-screen">Booting ScaleForge...</div>
    } @else {
      <router-outlet />
    }
  `,
  styles: [
    `
      .boot-screen {
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-size: 1.1rem;
        background: linear-gradient(135deg, #eef2ff, #ffffff);
      }
    `
  ]
})
export class AppComponent {
  readonly authStore = inject(AuthStoreService);
}
