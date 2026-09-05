import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { guestGuard } from "./core/guards/guest.guard";
import { roleGuard } from "./core/guards/role.guard";
import { AuthLayoutComponent } from "./layouts/auth-layout.component";
import { DashboardLayoutComponent } from "./layouts/dashboard-layout.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "dashboard"
  },
  {
    path: "",
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: "login",
        loadComponent: () =>
          import("./features/auth/pages/login.page").then((m) => m.LoginPage)
      },
      {
        path: "signup",
        loadComponent: () =>
          import("./features/auth/pages/signup.page").then((m) => m.SignupPage)
      },
      {
        path: "forgot-password",
        loadComponent: () =>
          import("./features/auth/pages/forgot-password.page").then(
            (m) => m.ForgotPasswordPage
          )
      },
      {
        path: "reset-password",
        loadComponent: () =>
          import("./features/auth/pages/reset-password.page").then(
            (m) => m.ResetPasswordPage
          )
      }
    ]
  },
  {
    path: "",
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./features/dashboard/pages/dashboard.page").then(
            (m) => m.DashboardPage
          )
      },
      {
        path: "profile",
        loadComponent: () =>
          import("./features/profile/pages/profile.page").then(
            (m) => m.ProfilePage
          )
      },
      {
        path: "users",
        canActivate: [roleGuard],
        data: {
          roles: ["manager", "admin"]
        },
        loadComponent: () =>
          import("./features/users/pages/users-list.page").then(
            (m) => m.UsersListPage
          )
      },
      {
        path: "users/:id",
        canActivate: [roleGuard],
        data: {
          roles: ["manager", "admin"]
        },
        loadComponent: () =>
          import("./features/users/pages/user-details.page").then(
            (m) => m.UserDetailsPage
          )
      },
      {
        path: "settings",
        loadComponent: () =>
          import("./features/settings/pages/settings.page").then(
            (m) => m.SettingsPage
          )
      },
      {
        path: "admin",
        canActivate: [roleGuard],
        data: {
          roles: ["admin"]
        },
        children: [
          {
            path: "",
            pathMatch: "full",
            redirectTo: "analytics"
          },
          {
            path: "users",
            loadComponent: () =>
              import("./features/admin/pages/user-management.page").then(
                (m) => m.UserManagementPage
              )
          },
          {
            path: "roles",
            loadComponent: () =>
              import("./features/admin/pages/role-management.page").then(
                (m) => m.RoleManagementPage
              )
          },
          {
            path: "analytics",
            loadComponent: () =>
              import("./features/admin/pages/analytics-dashboard.page").then(
                (m) => m.AnalyticsDashboardPage
              )
          }
        ]
      }
    ]
  },
  {
    path: "**",
    redirectTo: "dashboard"
  }
];
