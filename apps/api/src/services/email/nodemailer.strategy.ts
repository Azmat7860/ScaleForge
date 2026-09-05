import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { env } from "../../config/env";
import { createLogger } from "../../utils/logger";
import { EmailStrategy } from "./email-strategy.interface";
import { EmailPayload } from "./email.types";

const nodemailerLogger = createLogger("nodemailer-strategy");

export class NodemailerStrategy implements EmailStrategy {
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    this.transporter = nodemailer.createTransport({
      service: env.SMTP_SERVICE || undefined,
      host: env.SMTP_HOST || undefined,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    });

    return this.transporter;
  }

  async send(payload: EmailPayload): Promise<void> {
    const transporter = this.getTransporter();
    const result: SMTPTransport.SentMessageInfo = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html
    });

    nodemailerLogger.info(
      {
        provider: "nodemailer",
        from: env.EMAIL_FROM,
        to: payload.to,
        subject: payload.subject,
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected
      },
      "Email accepted by SMTP provider"
    );
  }
}
