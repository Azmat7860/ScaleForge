import { z } from "zod";
import { getActivitiesQuerySchema } from "./activity.validation";

export type ActivityAction =
  | "user-signed-up"
  | "user-logged-in"
  | "password-changed"
  | "profile-updated"
  | "password-reset-requested"
  | "password-reset-completed"
  | "user-created"
  | "role-updated"
  | "welcome-email-sent"
  | "welcome-email-failed";

export type ActivityLog = {
  id: string;
  actorId?: string | null;
  actorName?: string | null;
  actorEmail?: string | null;
  action: ActivityAction;
  description: string;
  targetType: "user" | "auth" | "notification" | "system";
  targetId?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateActivityLogInput = Omit<
  ActivityLog,
  "id" | "createdAt" | "updatedAt"
>;

export type GetActivitiesQueryDto = z.infer<
  typeof getActivitiesQuerySchema
>["query"];
