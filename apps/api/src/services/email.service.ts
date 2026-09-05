import { env } from "../config/env";
import { createEmailStrategy } from "./email/email-strategy.factory";
import { EmailStrategy } from "./email/email-strategy.interface";

export class EmailService {
  constructor(
    private readonly emailStrategy: EmailStrategy = createEmailStrategy(
      env.EMAIL_PROVIDER
    )
  ) {}

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.emailStrategy.send({
      to: email,
      subject: "Welcome to ScaleForge",
      text: `Hi ${name}, welcome to ScaleForge.`,
      html: `<p>Hi <strong>${name}</strong>, welcome to ScaleForge.</p>`
    });
  }

  async sendResetPasswordEmail(email: string, resetToken: string): Promise<void> {
    await this.emailStrategy.send({
      to: email,
      subject: "Reset your ScaleForge password",
      text: `Use this reset token to update your password: ${resetToken}`,
      html: `<p>Use this reset token to update your password:</p><p><strong>${resetToken}</strong></p>`
    });
  }
}
