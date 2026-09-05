import { JobsOptions, Queue, QueueOptions } from "bullmq";
import { createQueueRedisConnection } from "../config/redis";
import { createLogger } from "../utils/logger";

export class BaseQueue<TJobData> {
  private readonly queueLogger = createLogger("queue");
  private readonly queue: Queue<TJobData, void, string>;

  constructor(queueName: string, options?: Omit<QueueOptions, "connection">) {
    this.queue = new Queue<TJobData, void, string>(queueName, {
      ...options,
      connection: createQueueRedisConnection(`${queueName}-producer`)
    });
  }

  async add(
    jobName: string,
    payload: TJobData,
    options?: JobsOptions
  ): Promise<void> {
    await this.queue.add(
      jobName as Parameters<Queue<TJobData, void, string>["add"]>[0],
      payload as Parameters<Queue<TJobData, void, string>["add"]>[1],
      options
    );
    this.queueLogger.info(
      {
        queue: this.queue.name,
        jobName,
        payload
      },
      "Job added to queue"
    );
  }

  async close(): Promise<void> {
    await this.queue.close();
  }
}
