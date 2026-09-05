import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate.middleware";
import { authController } from "./auth.module";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema
} from "./auth.validation";

const authRouter = Router();

authRouter.post("/signup", validateRequest(signupSchema), authController.signup);
authRouter.post("/register", validateRequest(signupSchema), authController.signup);
authRouter.post("/login", validateRequest(loginSchema), authController.login);
authRouter.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword
);
authRouter.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  authController.resetPassword
);
authRouter.get("/me", authenticate, authController.getProfile);

export { authRouter };
