import { CommonModule } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs";
import { UserService } from "../../../core/services/user.service";
import { LoaderComponent } from "../../../shared/components/loader.component";
import { PageHeaderComponent } from "../../../shared/components/page-header.component";
import { TableColumn, TableComponent } from "../../../shared/components/table.component";

@Component({
  selector: "sf-users-list-page",
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    PageHeaderComponent,
    ReactiveFormsModule,
    TableComponent
  ],
  template: `
    <sf-page-header
      title="Users"
      subtitle="Manager and admin workspace with search, filters, and pagination."
    />

    <section class="filters-shell" [formGroup]="filtersForm">
      <input type="search" formControlName="search" placeholder="Search by name or email" />

      <select formControlName="role">
        <option value="all">All roles</option>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="user">User</option>
      </select>
    </section>

    <sf-loader [loading]="userService.loading()" label="Loading users..." />

    <sf-table
      [columns]="columns"
      [rows]="tableRows()"
      rowLinkBasePath="/users"
      rowLinkLabel="Details"
      emptyMessage="No users found for the selected filters."
    />

    <section class="pagination-shell">
      <button type="button" (click)="changePage(-1)" [disabled]="currentPage() <= 1">
        Previous
      </button>
      <span>Page {{ currentPage() }} of {{ totalPages() }}</span>
      <button type="button" (click)="changePage(1)" [disabled]="currentPage() >= totalPages()">
        Next
      </button>
    </section>
  `,
  styles: [
    `
      .filters-shell,
      .pagination-shell {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1rem;
      }
      .filters-shell input {
        min-width: 260px;
      }
      .filters-shell > * {
        flex: 1 1 0;
      }
      .pagination-shell {
        justify-content: flex-end;
        margin-top: 1rem;
      }
      .pagination-shell button {
        min-width: 7rem;
      }
      @media (max-width: 900px) {
        .filters-shell {
          flex-direction: column;
          align-items: stretch;
        }
      }
      @media (max-width: 640px) {
        .pagination-shell {
          justify-content: space-between;
          flex-wrap: wrap;
        }
      }
    `
  ]
})
export class UsersListPage {
  private readonly formBuilder = inject(FormBuilder);
  readonly userService = inject(UserService);
  readonly columns: TableColumn[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "lastLoginAt", label: "Last Login" }
  ];
  readonly currentPage = computed(() => this.userService.filters().page);
  readonly totalPages = computed(() => this.userService.totalPages());
  readonly tableRows = computed(() =>
    this.userService.users().map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLoginAt: user.lastLoginAt
        ? new Date(user.lastLoginAt).toLocaleString()
        : "Never"
    }))
  );

  readonly filtersForm = this.formBuilder.nonNullable.group({
    search: [""],
    role: ["all" as const]
  });

  constructor() {
    this.userService.loadUsers().subscribe();

    this.filtersForm.controls.search.valueChanges
      .pipe(debounceTime(300))
      .subscribe((search) => {
        this.userService
          .loadUsers({
            page: 1,
            search,
            role: this.filtersForm.controls.role.getRawValue()
          })
          .subscribe();
      });

    this.filtersForm.controls.role.valueChanges.subscribe((role) => {
      this.userService
        .loadUsers({
          page: 1,
          role,
          search: this.filtersForm.controls.search.getRawValue()
        })
        .subscribe();
    });
  }

  changePage(direction: -1 | 1): void {
    this.userService
      .loadUsers({
        page: this.currentPage() + direction
      })
      .subscribe();
  }
}
