import express from "express";
import morgan from "morgan";
import { appConfig } from "./config/app.config";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import {
  requestAuditMiddleware,
  securityMiddlewares
} from "./middlewares/security.middleware";
import { apiRouter } from "./routes";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", appConfig.trustProxy);
app.use(morgan("dev"));
app.use(requestAuditMiddleware);
securityMiddlewares.forEach((middleware) => {
  app.use(middleware);
});

app.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is healthy"
  });
});

app.use(appConfig.apiPrefix, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
