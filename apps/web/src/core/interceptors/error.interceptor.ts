import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthStoreService } from "../services/auth-store.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const isBootstrappingSession =
          !authStore.initialized() && authStore.isAuthenticated();
        const isAuthFormRequest =
          req.url.includes("/auth/login") || req.url.includes("/auth/signup");

        if (!isBootstrappingSession && !isAuthFormRequest) {
          authStore.logout(false);
          void router.navigate(["/login"]);
        }
      }

      if (error.status === 403) {
        void router.navigate(["/dashboard"]);
      }

      if (error.status >= 500) {
        console.error("Server error:", error.error?.message ?? error.message);
      }

      return throwError(() => error);
    })
  );
};
