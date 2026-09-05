import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { RoleOption, User } from "../../../core/models/user.models";
import { ToastService } from "../../../core/services/toast.service";
import { UserService } from "../../../core/services/user.service";
import { LoaderComponent } from "../../../shared/components/loader.component";
import { PageHeaderComponent } from "../../../shared/components/page-header.component";

@Component({
  selector: "sf-role-management-page",
  standalone: true,
  imports: [CommonModule, LoaderComponent, PageHeaderComponent],
  template: `
    <sf-page-header
      title="Role Management"
      subtitle="Update RBAC assignments using the backend role API."
    />

    <sf-loader [loading]="userService.loading()" label="Loading roles..." />

    <section class="card">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Current Role</th>
            <th>Update Role</th>
          </tr>
        </thead>
        <tbody>
          @for (user of users(); track user.id) {
            <tr>
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
              <td>
                <select
                  [value]="user.role"
                  (change)="updateRole(user.id, $any($event.target).value)"
                >
                  @for (role of roles(); track role.value) {
                    <option [value]="role.value">{{ role.label }}</option>
                  }
                </select>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </section>
  `,
  styles: [
    `
      .card {
        padding: 1.25rem;
        background: white;
        border-radius: 1rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 0.9rem;
        border-bottom: 1px solid #edf1fb;
        text-align: left;
      }
      select {
        padding: 0.65rem 0.75rem;
        border-radius: 0.8rem;
      }
    `
  ]
})
export class RoleManagementPage {
  readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly users = signal<User[]>([]);
  readonly roles = signal<RoleOption[]>([]);

  constructor() {
    this.loadUsers();
    this.userService.loadRoles().subscribe((roles) => {
      this.roles.set(roles);
    });
  }

  updateRole(userId: string, role: string): void {
    this.userService
      .updateUserRole(userId, { role: role as User["role"] })
      .subscribe(() => {
        this.toastService.success("User role updated successfully");
        this.loadUsers();
      });
  }

  private loadUsers(): void {
    this.userService.loadUsers().subscribe((response) => {
      this.users.set(response.items);
    });
  }
}
