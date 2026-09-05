import { logger } from "../utils/logger";
import mongoose from "mongoose";
import { env } from "./env";

export const connectDatabase = async (): Promise<void> => {
  logger.info(`Connecting MongoDB: ${env.MONGODB_URI}`);

  await mongoose.connect(env.MONGODB_URI);

  logger.info("MongoDB connected");
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === mongoose.STATES.disconnected) {
    return;
  }

  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
};
