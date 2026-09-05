import { EmailProvider } from "./email.types";
import { EmailStrategy } from "./email-strategy.interface";
import { NodemailerStrategy } from "./nodemailer.strategy";
import { SendGridStrategy } from "./sendgrid.strategy";

export const createEmailStrategy = (
  provider: EmailProvider
): EmailStrategy => {
  switch (provider) {
    case "sendgrid":
      return new SendGridStrategy();
    case "nodemailer":
    default:
      return new NodemailerStrategy();
  }
};
