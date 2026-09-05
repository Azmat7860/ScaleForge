import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "sf-auth-layout",
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="auth-shell">
      <section class="auth-hero">
        <p class="badge">ScaleForge Admin Portal</p>
        <h1>Build a SaaS dashboard while practicing modern Angular.</h1>
        <p>
          Standalone components, signals, route guards, interceptors, typed
          services, and real backend integration in one workspace.
        </p>
      </section>

      <section class="auth-card">
        <router-outlet />
      </section>
    </main>
  `,
  styles: [
    `
      .auth-shell {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        background:
          radial-gradient(circle at top left, rgba(15, 118, 110, 0.3), transparent 28%),
          radial-gradient(circle at bottom right, rgba(180, 83, 9, 0.16), transparent 24%),
          linear-gradient(135deg, #071f1d, #0b312d 48%, #14544d);
      }
      .auth-hero {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 4rem;
        color: #f5f7ff;
      }
      .badge {
        width: fit-content;
        padding: 0.4rem 0.75rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
      h1 {
        margin: 1rem 0;
        font-size: clamp(2.5rem, 5vw, 4.25rem);
        line-height: 1;
      }
      .auth-card {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background:
          radial-gradient(circle at top right, rgba(15, 118, 110, 0.08), transparent 20%),
          rgba(252, 255, 253, 0.97);
      }
      @media (max-width: 960px) {
        .auth-shell {
          grid-template-columns: 1fr;
        }
        .auth-hero {
          padding: 2rem 2rem 0;
        }
      }
    `
  ]
})
export class AuthLayoutComponent {}
