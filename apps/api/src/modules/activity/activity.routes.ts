import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate.middleware";
import { activityController } from "./activity.module";
import { getActivitiesQuerySchema } from "./activity.validation";

const activityRouter = Router();

activityRouter.get(
  "/me",
  authenticate,
  validateRequest(getActivitiesQuerySchema),
  activityController.getMyActivities
);

activityRouter.get(
  "/recent",
  authenticate,
  authorizeRoles("admin"),
  validateRequest(getActivitiesQuerySchema),
  activityController.getRecentActivities
);

export { activityRouter };
