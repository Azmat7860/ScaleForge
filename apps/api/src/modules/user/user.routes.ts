import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate.middleware";
import {
  createUserSchema,
  getUsersQuerySchema,
  getUserByIdSchema,
  updateUserSchema,
  updateUserRoleSchema
} from "./user.validation";
import { userController } from "./user.module";

const userRouter = Router();

userRouter.get("/roles/list", authenticate, userController.getRoleOptions);
userRouter.get("/stats", authenticate, userController.getDashboardStats);
userRouter.get(
  "/",
  authenticate,
  authorizeRoles("manager", "admin"),
  validateRequest(getUsersQuerySchema),
  userController.getAllUsers
);
userRouter.get("/:id", authenticate, validateRequest(getUserByIdSchema), userController.getProfile);
userRouter.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  validateRequest(createUserSchema),
  userController.createUser
);
userRouter.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validateRequest(updateUserSchema),
  userController.updateUser
);
userRouter.patch(
  "/:id/role",
  authenticate,
  authorizeRoles("admin"),
  validateRequest(updateUserRoleSchema),
  userController.updateUserRole
);
userRouter.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validateRequest(getUserByIdSchema),
  userController.deleteUser
);

export { userRouter };
