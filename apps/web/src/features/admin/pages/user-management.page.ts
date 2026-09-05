import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { finalize } from "rxjs";
import { RoleOption, UpdateUserDto, User } from "../../../core/models/user.models";
import { ToastService } from "../../../core/services/toast.service";
import { UserService } from "../../../core/services/user.service";
import { LoaderComponent } from "../../../shared/components/loader.component";
import { ModalComponent } from "../../../shared/components/modal.component";
import { PageHeaderComponent } from "../../../shared/components/page-header.component";

@Component({
  selector: "sf-user-management-page",
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    ModalComponent,
    PageHeaderComponent,
    ReactiveFormsModule
  ],
  template: `
    <sf-page-header
      title="User Management"
      subtitle="Admin-only workspace to create users and review the roster."
    />

    <section class="toolbar">
      <button type="button" class="btn-primary" (click)="isCreateModalOpen.set(true)">
        Create user
      </button>
    </section>

    <sf-loader [loading]="userService.loading()" label="Loading user management..." />

    <section class="management-table-shell">
      @if (users().length === 0) {
        <p class="empty-state">No users available yet.</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td class="actions-cell">
                  <button
                    type="button"
                    class="btn-secondary btn-sm"
                    (click)="openEditModal(user)"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="btn-danger btn-sm"
                    (click)="deleteUser(user)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>

    <sf-modal
      [open]="isCreateModalOpen()"
      title="Create User"
      eyebrow="Admin Action"
      (closed)="isCreateModalOpen.set(false)"
    >
      <form class="modal-form" [formGroup]="form" (ngSubmit)="submit()">
        <label>
          Name
          <input type="text" formControlName="name" />
        </label>

        <label>
          Email
          <input type="email" formControlName="email" />
        </label>

        <label>
          Password
          <input type="password" formControlName="password" />
        </label>

        <label>
          Role
          <select formControlName="role">
            @for (role of roleOptions(); track role.value) {
              <option [value]="role.value">{{ role.label }}</option>
            }
          </select>
        </label>

        <button type="submit" class="btn-primary" [disabled]="submitting()">
          {{ submitting() ? "Creating..." : "Create user" }}
        </button>
      </form>
    </sf-modal>

    <sf-modal
      [open]="isEditModalOpen()"
      title="Edit User"
      eyebrow="Admin Action"
      (closed)="closeEditModal()"
    >
      <form class="modal-form" [formGroup]="editForm" (ngSubmit)="submitEdit()">
        <label>
          Name
          <input type="text" formControlName="name" />
        </label>

        <label>
          Email
          <input type="email" formControlName="email" />
        </label>

        <label>
          Role
          <select formControlName="role">
            @for (role of roleOptions(); track role.value) {
              <option [value]="role.value">{{ role.label }}</option>
            }
          </select>
        </label>

        <button type="submit" class="btn-primary" [disabled]="submittingEdit()">
          {{ submittingEdit() ? "Updating..." : "Save changes" }}
        </button>
      </form>
    </sf-modal>
  `,
  styles: [
    `
      .toolbar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;
      }
      .management-table-shell {
        overflow: hidden;
        border-radius: 1.2rem;
        background: var(--surface);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-soft);
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 1rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.16);
        text-align: left;
      }
      th {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-subtle);
        background: rgba(248, 250, 252, 0.86);
      }
      .actions-cell {
        display: flex;
        gap: 0.65rem;
        flex-wrap: wrap;
      }
      .empty-state {
        margin: 0;
        padding: 1.25rem;
        color: var(--text-muted);
      }
      .modal-form,
      label {
        display: grid;
        gap: 0.75rem;
      }
      .modal-form button {
        margin-top: 0.5rem;
      }
      @media (max-width: 820px) {
        .management-table-shell {
          overflow-x: auto;
        }
      }
    `
  ]
})
export class UserManagementPage {
  private readonly formBuilder = inject(FormBuilder);
  readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly isCreateModalOpen = signal(false);
  readonly isEditModalOpen = signal(false);
  readonly editingUser = signal<User | null>(null);
  readonly roleOptions = computed<RoleOption[]>(() => this.userService.roleOptions());
  readonly users = computed(() => this.userService.users());
  readonly submitting = signal(false);
  readonly submittingEdit = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(3)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    role: ["user" as RoleOption["value"], [Validators.required]]
  });

  readonly editForm = this.formBuilder.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(3)]],
    email: ["", [Validators.required, Validators.email]],
    role: ["user" as RoleOption["value"], [Validators.required]]
  });

  constructor() {
    this.loadUsers();
    this.userService.loadRoles().subscribe();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    this.userService
      .createUser(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe(() => {
        this.form.reset({
          name: "",
          email: "",
          password: "",
          role: "user"
        });
        this.isCreateModalOpen.set(false);
        this.toastService.success("User created successfully");
        this.loadUsers();
      });
  }

  openEditModal(user: User): void {
    this.editingUser.set(user);
    this.editForm.reset({
      name: user.name,
      email: user.email,
      role: user.role
    });
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.editingUser.set(null);
  }

  submitEdit(): void {
    if (this.editForm.invalid || !this.editingUser()) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.submittingEdit.set(true);

    this.userService
      .updateUser(this.editingUser()!.id, this.editForm.getRawValue() as UpdateUserDto)
      .pipe(finalize(() => this.submittingEdit.set(false)))
      .subscribe(() => {
        this.toastService.success("User updated successfully");
        this.closeEditModal();
        this.loadUsers();
      });
  }

  deleteUser(user: User): void {
    const shouldDelete = globalThis.confirm(
      `Delete ${user.name} (${user.email})?`
    );

    if (!shouldDelete) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe(() => {
      this.toastService.success("User deleted successfully");
      this.loadUsers();
    });
  }

  private loadUsers(): void {
    this.userService.loadUsers().subscribe();
  }
}
