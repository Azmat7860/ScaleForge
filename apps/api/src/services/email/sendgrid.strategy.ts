import { env } from "../../config/env";
import { createLogger } from "../../utils/logger";
import { EmailStrategy } from "./email-strategy.interface";
import { EmailPayload } from "./email.types";

const sendgridLogger = createLogger("sendgrid-strategy");

export class SendGridStrategy implements EmailStrategy {
  async send(payload: EmailPayload): Promise<void> {
    if (!env.SENDGRID_API_KEY || env.SENDGRID_API_KEY === "sendgrid-api-key") {
      throw new Error(
        "SendGrid is selected but SENDGRID_API_KEY is missing or still using the placeholder value."
      );
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: payload.to }]
          }
        ],
        from: {
          email: env.EMAIL_FROM
        },
        subject: payload.subject,
        content: [
          {
            type: "text/plain",
            value: payload.text
          },
          {
            type: "text/html",
            value: payload.html
          }
        ]
      })
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(
        `SendGrid request failed with status ${response.status}: ${responseText || "Unknown error"}`
      );
    }

    sendgridLogger.info(
      {
        provider: "sendgrid",
        from: env.EMAIL_FROM,
        to: payload.to,
        subject: payload.subject
      },
      "Email sent with SendGrid strategy"
    );
  }
}
