import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  selector: "sf-reset-password-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-form-shell">
      <div>
        <p class="eyebrow">Almost there</p>
        <h2>Reset password</h2>
        <p class="copy">Enter the token from email and choose a new password.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>
          Reset token
          <input type="text" formControlName="token" />
        </label>

        <label>
          New password
          <input type="password" formControlName="password" />
        </label>

        @if (successMessage()) {
          <p class="success">{{ successMessage() }}</p>
        }

        @if (errorMessage()) {
          <p class="error">{{ errorMessage() }}</p>
        }

        <button type="submit" class="btn-primary" [disabled]="submitting()">
          {{ submitting() ? "Resetting..." : "Reset password" }}
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
      .error {
        color: #cb2c53;
      }
    `
  ]
})
export class ResetPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly successMessage = signal("");
  readonly errorMessage = signal("");
  readonly submitting = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    token: [this.activatedRoute.snapshot.queryParamMap.get("token") ?? "", [Validators.required]],
    password: ["", [Validators.required, Validators.minLength(8)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.successMessage.set("");
    this.errorMessage.set("");
    this.submitting.set(true);

    this.authService
      .resetPassword(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set(response.message);
          this.toastService.success("Password reset successfully");
          setTimeout(() => {
            void this.router.navigate(["/login"]);
          }, 900);
        },
        error: (error: { error?: { message?: string } }) => {
          this.errorMessage.set(
            error.error?.message ?? "Could not reset password"
          );
        }
      });
  }
}
