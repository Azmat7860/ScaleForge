import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { AutofocusDirective } from "../../../shared/directives/autofocus.directive";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  selector: "sf-login-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AutofocusDirective],
  template: `
    <section class="auth-form-shell">
      <div>
        <p class="eyebrow">Welcome back</p>
        <h2>Login</h2>
        <p class="copy">Use your credentials to access the admin portal.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" autocomplete="off" novalidate>
        <label>
          Email
          <input
            sfAutofocus
            type="email"
            formControlName="email"
            placeholder="Enter your email"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            formControlName="password"
            placeholder="Enter your password"
            autocomplete="new-password"
          />
        </label>

        @if (errorMessage()) {
          <p class="error">{{ errorMessage() }}</p>
        }

        <button type="submit" class="btn-primary" [disabled]="submitting()">
          {{ submitting() ? "Signing in..." : "Login" }}
        </button>
      </form>

      <div class="auth-links">
        <a routerLink="/forgot-password">Forgot password?</a>
        <a routerLink="/signup">Create account</a>
      </div>
    </section>
  `,
  styles: [
    `
      .auth-form-shell {
        width: min(460px, 100%);
      }
      form {
        display: grid;
        gap: 1rem;
        margin-top: 2rem;
      }
      label {
        display: grid;
        gap: 0.45rem;
        font-weight: 600;
      }
      input {
        padding: 0.9rem 1rem;
        border-radius: 0.9rem;
        border: 1px solid #cfd6ea;
      }
      .auth-links {
        display: flex;
        justify-content: space-between;
        margin-top: 1.25rem;
      }
      .error {
        color: #cb2c53;
      }
      .eyebrow,
      .copy {
        color: #66728d;
      }
      h2 {
        margin: 0.25rem 0 0.5rem;
        font-size: 2rem;
      }
    `
  ]
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly errorMessage = signal("");
  readonly submitting = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set("");
    this.submitting.set(true);

    this.authService
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.toastService.success("Login successful");
          void this.router.navigate(["/dashboard"]);
        },
        error: (error: { error?: { message?: string } }) => {
          this.errorMessage.set(error.error?.message ?? "Login failed");
        }
      });
  }
}
