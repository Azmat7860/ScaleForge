export type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type EmailProvider = "nodemailer" | "sendgrid";
