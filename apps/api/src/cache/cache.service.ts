import { Redis } from "ioredis";
import { getRedisClient } from "../config/redis";
import { createLogger } from "../utils/logger";

const cacheLogger = createLogger("cache");

type CacheSetOptions = {
  ttlInSeconds?: number;
};

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void>;
  del(key: string): Promise<void>;
}

export class CacheService implements ICacheService {
  constructor(private readonly redisClient: Redis = getRedisClient()) {}

  async get<T>(key: string): Promise<T | null> {
    const cachedValue = await this.redisClient.get(key);

    if (!cachedValue) {
      cacheLogger.info({ key }, "Cache miss");
      return null;
    }

    cacheLogger.info({ key }, "Cache hit");
    return JSON.parse(cachedValue) as T;
  }

  async set<T>(
    key: string,
    value: T,
    options?: CacheSetOptions
  ): Promise<void> {
    const serializedValue = JSON.stringify(value);

    if (options?.ttlInSeconds) {
      await this.redisClient.set(key, serializedValue, "EX", options.ttlInSeconds);
    } else {
      await this.redisClient.set(key, serializedValue);
    }

    cacheLogger.info(
      { key, ttlInSeconds: options?.ttlInSeconds },
      "Cache value stored"
    );
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
    cacheLogger.info({ key }, "Cache value deleted");
  }
}
