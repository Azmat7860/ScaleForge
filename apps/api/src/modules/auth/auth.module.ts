import { activityLogService } from "../activity/activity.module";
import { notificationService } from "../notification/notification.module";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { emailQueueProducer } from "../../queues/email.queue";
import { EmailService } from "../../services/email.service";

const authRepository = new AuthRepository();
const emailService = new EmailService();
const authService = new AuthService(
  authRepository,
  emailQueueProducer,
  emailService,
  notificationService,
  activityLogService
);
const authController = new AuthController(authService);

export { authRepository, authService, authController };
