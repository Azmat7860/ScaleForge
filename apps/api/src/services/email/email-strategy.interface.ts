import { EmailPayload } from "./email.types";

export interface EmailStrategy {
  send(payload: EmailPayload): Promise<void>;
}
