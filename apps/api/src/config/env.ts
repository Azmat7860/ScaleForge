import { config } from "dotenv";
import { z } from "zod";

config();

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return value;
}, z.boolean());

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_NAME: z.string().default("ScaleForge"),
  API_PREFIX: z.string().default("/api/v1"),
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(1),
  JWT_SECRET: z.string().min(8).default("replace-me"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15).default(10),
  MONGODB_URI: z
    .string()
    .min(1)
    .default("mongodb://127.0.0.1:27017/scaleforge"),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  CORS_ORIGINS: z.string().default("http://localhost:4200,http://localhost:3000"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  BODY_SIZE_LIMIT: z.string().default("10kb"),
  EMAIL_PROVIDER: z.enum(["nodemailer", "sendgrid"]).default("nodemailer"),
  EMAIL_FROM: z.string().email().default("no-reply@scaleforge.dev"),
  SMTP_SERVICE: z.string().default("gmail"),
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_SECURE: booleanFromEnv.default(true),
  SMTP_USER: z.string().email().default("demo@gmail.com"),
  SMTP_PASS: z.string().min(1).default("app-password"),
  SENDGRID_API_KEY: z.string().default("")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(
      parsedEnv.error.flatten().fieldErrors
    )}`
  );
}

export const env = parsedEnv.data;
export const corsOrigins = env.CORS_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
