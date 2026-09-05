import { ConnectionOptions } from "bullmq";
import IORedis, { Redis } from "ioredis";
import { env } from "./env";
import { createLogger } from "../utils/logger";

const redisLogger = createLogger("redis");

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true
    });
  }

  return redisClient;
};

export const createQueueRedisConnection = (
  connectionName: string
): ConnectionOptions => {
  const redisUrl = new URL(env.REDIS_URL);
  const db = redisUrl.pathname ? Number(redisUrl.pathname.slice(1) || "0") : 0;

  return {
    host: redisUrl.hostname,
    port: Number(redisUrl.port || 6379),
    username: redisUrl.username || undefined,
    password: redisUrl.password || undefined,
    db,
    connectionName,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  };
};

export const connectRedis = async (): Promise<void> => {
  redisLogger.info({ url: env.REDIS_URL }, "Connecting Redis");

  const client = getRedisClient();
  await client.ping();

  redisLogger.info("Redis connected");
};

export const disconnectRedis = async (): Promise<void> => {
  if (!redisClient) {
    return;
  }

  await redisClient.quit();
  redisClient = null;

  redisLogger.info("Redis disconnected");
};
