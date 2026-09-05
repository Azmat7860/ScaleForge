import { z } from "zod";

export const getActivitiesQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(20).default(10)
  })
});
