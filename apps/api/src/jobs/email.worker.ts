import { Job, Worker } from "bullmq";
import { createQueueRedisConnection } from "../config/redis";
import { WelcomeEmailJob } from "./welcome-email.job";
import { WelcomeEmailJobData } from "../queues/email.queue";
import { QUEUE_JOB_NAMES, QUEUE_NAMES } from "../queues/queue.constants";
import { activityLogService } from "../modules/activity/activity.module";
import { notificationService } from "../modules/notification/notification.module";
import { EmailService } from "../services/email.service";
import { createLogger } from "../utils/logger";

const workerLogger = createLogger("email-worker");

export class EmailWorker {
  private readonly welcomeEmailJob: WelcomeEmailJob;
  private readonly worker: Worker<WelcomeEmailJobData, void, string>;

  constructor(emailService: EmailService = new EmailService()) {
    this.welcomeEmailJob = new WelcomeEmailJob(emailService);
    this.worker = new Worker<WelcomeEmailJobData, void, string>(
      QUEUE_NAMES.EMAIL,
      async (job) => this.process(job),
      {
        connection: createQueueRedisConnection("email-worker"),
        concurrency: 5
      }
    );

    this.registerEvents();
  }

  private async process(job: Job<WelcomeEmailJobData>): Promise<void> {
    switch (job.name) {
      case QUEUE_JOB_NAMES.SEND_WELCOME_EMAIL:
        await this.welcomeEmailJob.handle(job.data);
        if (job.data.notificationId) {
          await notificationService.markAsSent(job.data.notificationId);
        }
        await activityLogService.logSystemEvent({
          actorId: job.data.userId,
          actorName: job.data.name,
          actorEmail: job.data.email,
          action: "welcome-email-sent",
          description: "Welcome email delivered successfully.",
          targetType: "notification",
          targetId: job.data.notificationId,
          metadata: {
            channel: "email"
          }
        });
        return;
      default:
        workerLogger.warn({ jobName: job.name }, "Unknown queue job received");
    }
  }

  private registerEvents(): void {
    this.worker.on("completed", (job) => {
      workerLogger.info(
        { jobId: job.id, jobName: job.name },
        "Email worker completed job"
      );
    });

    this.worker.on("failed", (job, error) => {
      if (job?.data.notificationId) {
        void notificationService.markAsFailed(
          job.data.notificationId,
          error.message
        );
      }
      if (job) {
        void activityLogService.logSystemEvent({
          actorId: job.data.userId,
          actorName: job.data.name,
          actorEmail: job.data.email,
          action: "welcome-email-failed",
          description: "Welcome email delivery failed.",
          targetType: "notification",
          targetId: job.data.notificationId,
          metadata: {
            channel: "email",
            reason: error.message
          }
        });
      }
      workerLogger.error(
        {
          jobId: job?.id,
          jobName: job?.name,
          error: error.message
        },
        "Email worker failed job"
      );
    });
  }

  async close(): Promise<void> {
    await this.worker.close();
  }
}
