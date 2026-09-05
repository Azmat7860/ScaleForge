import { JobsOptions } from "bullmq";
import { BaseQueue } from "./base.queue";
import { QUEUE_JOB_NAMES, QUEUE_NAMES } from "./queue.constants";

export type WelcomeEmailJobData = {
  userId: string;
  email: string;
  name: string;
  notificationId?: string;
};

export interface IEmailQueueProducer {
  enqueueWelcomeEmail(payload: WelcomeEmailJobData): Promise<void>;
  close(): Promise<void>;
}

const welcomeEmailJobOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 3000
  },
  removeOnComplete: true,
  removeOnFail: false
};

export class EmailQueueProducer implements IEmailQueueProducer {
  private readonly emailQueue = new BaseQueue<WelcomeEmailJobData>(
    QUEUE_NAMES.EMAIL
  );

  async enqueueWelcomeEmail(payload: WelcomeEmailJobData): Promise<void> {
    await this.emailQueue.add(
      QUEUE_JOB_NAMES.SEND_WELCOME_EMAIL,
      payload,
      welcomeEmailJobOptions
    );
  }

  async close(): Promise<void> {
    await this.emailQueue.close();
  }
}

export const emailQueueProducer = new EmailQueueProducer();
