import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "sf-forgot-password-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-form-shell">
      <div>
        <p class="eyebrow">Recover access</p>
        <h2>Forgot password</h2>
        <p class="copy">Enter your email and we will generate a reset token.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>
          Email
          <input type="email" formControlName="email" />
        </label>

        @if (successMessage()) {
          <p class="success">{{ successMessage() }}</p>
        }

        @if (resetToken()) {
          <p class="token">
            Dev reset token:
            <strong>{{ resetToken() }}</strong>
          </p>
        }

        @if (errorMessage()) {
          <p class="error">{{ errorMessage() }}</p>
        }

        <button type="submit" class="btn-primary" [disabled]="submitting()">
          {{ submitting() ? "Sending..." : "Send reset instructions" }}
        </button>
      </form>

      <a routerLink="/login">Back to login</a>
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
      .success {
        color: #177245;
      }
      .token {
        color: #243a87;
      }
      .error {
        color: #cb2c53;
      }
    `
  ]
})
export class ForgotPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly successMessage = signal("");
  readonly errorMessage = signal("");
  readonly resetToken = signal("");
  readonly submitting = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    email: ["", [Validators.required, Validators.email]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.successMessage.set("");
    this.errorMessage.set("");
    this.resetToken.set("");
    this.submitting.set(true);

    this.authService
      .forgotPassword(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set(response.message);
          this.resetToken.set(response.resetToken ?? "");
        },
        error: (error: { error?: { message?: string } }) => {
          this.errorMessage.set(
            error.error?.message ?? "Could not process request"
          );
        }
      });
  }
}
