import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate.middleware";
import { notificationController } from "./notification.module";
import {
  getNotificationsQuerySchema,
  markNotificationReadSchema
} from "./notification.validation";

const notificationRouter = Router();

notificationRouter.get(
  "/",
  authenticate,
  validateRequest(getNotificationsQuerySchema),
  notificationController.getMyNotifications
);

notificationRouter.patch(
  "/:id/read",
  authenticate,
  validateRequest(markNotificationReadSchema),
  notificationController.markAsRead
);

export { notificationRouter };
