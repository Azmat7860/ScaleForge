import { CorsOptions } from "cors";
import helmet from "helmet";
import { env, corsOrigins } from "./env";

export const appConfig = {
  appName: env.APP_NAME,
  apiPrefix: env.API_PREFIX,
  port: env.PORT,
  trustProxy: env.TRUST_PROXY,
  bodySizeLimit: env.BODY_SIZE_LIMIT
} as const;

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
};

export const helmetConfig: Parameters<typeof helmet>[0] = {
  crossOriginResourcePolicy: { policy: "cross-origin" }
};
