import { z } from "zod";

export const getNotificationsQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(20).default(8)
  })
});

export const markNotificationReadSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
