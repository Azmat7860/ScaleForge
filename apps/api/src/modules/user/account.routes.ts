import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate.middleware";
import { userController } from "./user.module";
import {
  changePasswordSchema,
  updateProfileSchema
} from "./user.validation";

const accountRouter = Router();

accountRouter.get("/profile", authenticate, userController.getMyProfile);
accountRouter.put(
  "/profile",
  authenticate,
  validateRequest(updateProfileSchema),
  userController.updateMyProfile
);
accountRouter.put(
  "/change-password",
  authenticate,
  validateRequest(changePasswordSchema),
  userController.changeMyPassword
);

export { accountRouter };
