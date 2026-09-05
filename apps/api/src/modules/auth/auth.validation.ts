import { z } from "zod";

export const signupDtoSchema = z.object({
  name: z.string().trim().min(3).max(50),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(64)
});

export const loginDtoSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(64)
});

export const forgotPasswordDtoSchema = z.object({
  email: z.string().trim().email().toLowerCase()
});

export const resetPasswordDtoSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(64)
});

export const signupSchema = z.object({
  body: signupDtoSchema
});

export const loginSchema = z.object({
  body: loginDtoSchema
});

export const forgotPasswordSchema = z.object({
  body: forgotPasswordDtoSchema
});

export const resetPasswordSchema = z.object({
  body: resetPasswordDtoSchema
});
