import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { analyticsController } from "./analytics.module";

const analyticsRouter = Router();

analyticsRouter.get(
  "/overview",
  authenticate,
  authorizeRoles("admin"),
  analyticsController.getOverview
);

export { analyticsRouter };
