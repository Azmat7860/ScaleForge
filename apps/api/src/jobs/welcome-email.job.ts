import { EmailService } from "../services/email.service";
import { WelcomeEmailJobData } from "../queues/email.queue";

export class WelcomeEmailJob {
  constructor(private readonly emailService: EmailService) {}

  async handle(payload: WelcomeEmailJobData): Promise<void> {
    await this.emailService.sendWelcomeEmail(payload.email, payload.name);
  }
}
