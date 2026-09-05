import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthRole } from "../models/auth.models";
import { AuthStoreService } from "../services/auth-store.service";

const getAllowedRoles = (route: ActivatedRouteSnapshot): AuthRole[] => {
  return (route.data["roles"] as AuthRole[] | undefined) ?? [];
};

export const roleGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);
  const currentRole = authStore.currentUser()?.role;
  const allowedRoles = getAllowedRoles(route);

  if (!currentRole) {
    return router.createUrlTree(["/login"]);
  }

  if (currentRole && allowedRoles.includes(currentRole)) {
    return true;
  }

  return router.createUrlTree(["/dashboard"]);
};
