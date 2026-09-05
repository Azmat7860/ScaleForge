import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStoreService } from "../services/auth-store.service";

export const guestGuard: CanActivateFn = () => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  return authStore.isAuthenticated()
    ? router.createUrlTree(["/dashboard"])
    : true;
};
