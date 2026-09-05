import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(64),
    role: z.enum(["user", "manager", "admin"]).optional()
  })
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

export const getUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    role: z.enum(["all", "user", "manager", "admin"]).optional()
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    email: z.string().email()
  })
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    role: z.enum(["user", "manager", "admin"])
  })
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    role: z.enum(["user", "manager", "admin"])
  })
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z
        .string()
        .min(8, "Current password must be at least 8 characters")
        .max(64),
      newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .max(64)
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d).+$/,
          "New password must include at least one letter and one number"
        )
    })
    .refine(
      (data) => data.currentPassword !== data.newPassword,
      {
        message: "New password must be different from current password",
        path: ["newPassword"]
      }
    )
});
