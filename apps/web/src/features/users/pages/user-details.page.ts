import { DatePipe, Location } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { User } from "../../../core/models/user.models";
import { UserService } from "../../../core/services/user.service";
import { LoaderComponent } from "../../../shared/components/loader.component";
import { PageHeaderComponent } from "../../../shared/components/page-header.component";
import { RoleLabelPipe } from "../../../shared/pipes/role-label.pipe";

@Component({
  selector: "sf-user-details-page",
  standalone: true,
  imports: [DatePipe, LoaderComponent, PageHeaderComponent, RoleLabelPipe],
  template: `
    <sf-page-header
      title="User Details"
      subtitle="Review one user record from the backend."
    />

    <sf-loader [loading]="userService.loading()" label="Loading user..." />

    @if (user()) {
      <section class="detail-card">
        <button type="button" class="ghost-button back-button" (click)="goBack()">
          Back to users
        </button>
        <p><strong>Name:</strong> {{ user()?.name }}</p>
        <p><strong>Email:</strong> {{ user()?.email }}</p>
        <p><strong>Role:</strong> {{ user()!.role | roleLabel }}</p>
        <p><strong>Created:</strong> {{ user()?.createdAt | date: 'medium' }}</p>
        <p><strong>Last Login:</strong> {{ user()?.lastLoginAt ? (user()?.lastLoginAt | date: 'medium') : 'Never' }}</p>
      </section>
    }
  `,
  styles: [
    `
      .detail-card {
        padding: 1.25rem;
        border-radius: 1rem;
        background: var(--surface);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-soft);
      }
      .back-button {
        margin-bottom: 1rem;
      }
    `
  ]
})
export class UserDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  readonly userService = inject(UserService);

  readonly user = signal<User | null>(null);

  constructor() {
    const userId = this.route.snapshot.paramMap.get("id");

    if (!userId) {
      return;
    }

    this.userService.loadUserById(userId).subscribe((user) => {
      this.user.set(user);
    });
  }

  goBack(): void {
    if (globalThis.history.length <= 1) {
      void this.router.navigate(["/users"]);
      return;
    }

    this.location.back();
  }
}
