import { app } from "./app";
import { Server } from "node:http";
import { connectDatabase, disconnectDatabase } from "./config/db";
import { env } from "./config/env";
import { connectRedis, disconnectRedis } from "./config/redis";
import { EmailWorker } from "./jobs/email.worker";
import { emailQueueProducer } from "./queues/email.queue";
import { createLogger } from "./utils/logger";
import { getErrorMessage } from "./utils/error.utils";

const serverLogger = createLogger("server");
let server: Server | null = null;
let emailWorker: EmailWorker | null = null;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await connectRedis();
    emailWorker = new EmailWorker();

    server = app.listen(env.PORT, () => {
      serverLogger.info(
        {
          appName: env.APP_NAME,
          port: env.PORT
        },
        "HTTP server started"
      );
    });
  } catch (error) {
    serverLogger.fatal(
      { error: getErrorMessage(error) },
      "Failed to start server"
    );
    process.exit(1);
  }
};

const shutdown = async (): Promise<void> => {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  if (emailWorker) {
    await emailWorker.close();
  }

  await emailQueueProducer.close();
  await Promise.all([disconnectDatabase(), disconnectRedis()]);
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

void startServer();
