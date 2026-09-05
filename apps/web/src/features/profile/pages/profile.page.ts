import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { finalize } from "rxjs";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { UserService } from "../../../core/services/user.service";
import { LoaderComponent } from "../../../shared/components/loader.component";
import { PageHeaderComponent } from "../../../shared/components/page-header.component";

@Component({
  selector: "sf-profile-page",
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    ReactiveFormsModule,
    PageHeaderComponent
  ],
  template: `
    <sf-page-header
      title="Profile"
      subtitle="View your account, update profile details, and change your password."
    />

    <sf-loader [loading]="userService.loading()" label="Saving profile..." />

    <section class="profile-grid">
      <form class="profile-form" [formGroup]="form" (ngSubmit)="submitProfile()">
        <h3>Profile details</h3>

        <label>
          Name
          <input type="text" formControlName="name" />
        </label>

        <label>
          Email
          <input type="email" formControlName="email" />
        </label>

        @if (profileError()) {
          <p class="form-error">{{ profileError() }}</p>
        }

        <button type="submit" class="btn-primary" [disabled]="submittingProfile()">
          {{ submittingProfile() ? "Saving..." : "Save profile" }}
        </button>
      </form>

      <form class="profile-form" [formGroup]="passwordForm" (ngSubmit)="submitPassword()">
        <h3>Change password</h3>

        <label>
          Current password
          <input type="password" formControlName="currentPassword" />
        </label>
        @if (currentPasswordError) {
          <p class="field-error">{{ currentPasswordError }}</p>
        }

        <label>
          New password
          <input type="password" formControlName="newPassword" />
        </label>
        @if (newPasswordError) {
          <p class="field-error">{{ newPasswordError }}</p>
        }

        @if (passwordError()) {
          <p class="form-error">{{ passwordError() }}</p>
        }

        <button type="submit" class="btn-primary" [disabled]="submittingPassword()">
          {{ submittingPassword() ? "Updating..." : "Change password" }}
        </button>
      </form>
    </section>
  `,
  styles: [
    `
      .profile-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }
      .profile-form {
        display: grid;
        gap: 1rem;
        padding: 1.25rem;
        background: white;
        border-radius: 1rem;
      }
      label {
        display: grid;
        gap: 0.45rem;
      }
      input {
        padding: 0.85rem 1rem;
        border-radius: 0.85rem;
        border: 1px solid #cfd6ea;
      }
      .field-error,
      .form-error {
        margin: -0.35rem 0 0;
        font-size: 0.9rem;
        color: #b42318;
      }
      .profile-form button {
        width: fit-content;
      }
      @media (max-width: 960px) {
        .profile-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class ProfilePage {
  private readonly passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).+$/;
  private readonly formBuilder = inject(FormBuilder);
  readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  readonly submittingProfile = signal(false);
  readonly submittingPassword = signal(false);
  readonly profileError = signal("");
  readonly passwordError = signal("");

  readonly form = this.formBuilder.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(3)]],
    email: ["", [Validators.required, Validators.email]]
  });

  readonly passwordForm = this.formBuilder.nonNullable.group({
    currentPassword: ["", [Validators.required, Validators.minLength(8)]],
    newPassword: [
      "",
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern)
      ]
    ]
  });

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();

      if (!user) {
        return;
      }

      this.form.patchValue({
        name: user.name,
        email: user.email
      });
    });
  }

  get currentPasswordError(): string {
    const control = this.passwordForm.controls.currentPassword;

    if (!control.touched && !control.dirty) {
      return "";
    }

    if (control.hasError("required")) {
      return "Current password is required";
    }

    if (control.hasError("minlength")) {
      return "Current password must be at least 8 characters";
    }

    return "";
  }

  get newPasswordError(): string {
    const control = this.passwordForm.controls.newPassword;

    if (!control.touched && !control.dirty) {
      return "";
    }

    if (control.hasError("required")) {
      return "New password is required";
    }

    if (control.hasError("minlength")) {
      return "New password must be at least 8 characters";
    }

    if (control.hasError("pattern")) {
      return "New password must include at least one letter and one number";
    }

    if (this.passwordForm.getRawValue().currentPassword === control.getRawValue()) {
      return "New password must be different from current password";
    }

    return "";
  }

  submitProfile(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.profileError.set("");
    this.submittingProfile.set(true);

    this.userService
      .updateProfile(this.form.getRawValue())
      .pipe(finalize(() => this.submittingProfile.set(false)))
      .subscribe({
        next: (user) => {
          this.authService.setCurrentUser(user);
          this.toastService.success("Profile updated successfully");
        },
        error: (error: { error?: { message?: string } }) => {
          this.profileError.set(
            error.error?.message ?? "Could not update profile"
          );
        }
      });
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    if (
      this.passwordForm.getRawValue().currentPassword ===
      this.passwordForm.getRawValue().newPassword
    ) {
      this.passwordError.set(
        "New password must be different from current password"
      );
      return;
    }

    this.passwordError.set("");
    this.submittingPassword.set(true);

    this.userService
      .changePassword(this.passwordForm.getRawValue())
      .pipe(finalize(() => this.submittingPassword.set(false)))
      .subscribe({
        next: () => {
          this.passwordForm.reset({
            currentPassword: "",
            newPassword: ""
          });
          this.toastService.success("Password changed successfully");
        },
        error: (error: { error?: { message?: string } }) => {
          this.passwordError.set(
            error.error?.message ?? "Could not change password"
          );
        }
      });
  }
}
