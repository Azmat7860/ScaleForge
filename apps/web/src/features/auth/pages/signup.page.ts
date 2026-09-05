import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { AutofocusDirective } from "../../../shared/directives/autofocus.directive";

@Component({
  selector: "sf-signup-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AutofocusDirective],
  template: `
    <section class="auth-form-shell">
      <div>
        <p class="eyebrow">Start learning</p>
        <h2>Signup</h2>
        <p class="copy">Create your account to explore the SaaS admin portal.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" autocomplete="off" novalidate>
        <label>
          Full name
          <input
            sfAutofocus
            type="text"
            formControlName="name"
            placeholder="Enter your full name"
            autocomplete="off"
          />
        </label>

        <label>
          Email
          <input
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
            placeholder="Create a password"
            autocomplete="new-password"
          />
        </label>

        @if (errorMessage()) {
          <p class="error">{{ errorMessage() }}</p>
        }

        <button type="submit" class="btn-primary" [disabled]="submitting()">
          {{ submitting() ? "Creating..." : "Create account" }}
        </button>
      </form>

      <div class="auth-links">
        <span>Already have an account?</span>
        <a routerLink="/login">Login</a>
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
export class SignupPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly errorMessage = signal("");
  readonly submitting = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(3)]],
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
      .signup(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.toastService.success("Account created successfully");
          void this.router.navigate(["/dashboard"]);
        },
        error: (error: { error?: { message?: string } }) => {
          this.errorMessage.set(error.error?.message ?? "Signup failed");
        }
      });
  }
}
