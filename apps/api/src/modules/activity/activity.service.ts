import {
  ActivityLog,
  CreateActivityLogInput,
  GetActivitiesQueryDto
} from "./activity.types";
import { IActivityLogRepository, IActivityLogService } from "./activity.interface";

export class ActivityLogService implements IActivityLogService {
  constructor(
    private readonly activityLogRepository: IActivityLogRepository
  ) {}

  async create(input: CreateActivityLogInput): Promise<ActivityLog> {
    return this.activityLogRepository.create(input);
  }

  async getMyActivities(
    userId: string,
    query: GetActivitiesQueryDto
  ): Promise<ActivityLog[]> {
    return this.activityLogRepository.findByActorId(userId, query.limit);
  }

  async getRecentActivities(limit: number): Promise<ActivityLog[]> {
    return this.activityLogRepository.findRecent(limit);
  }

  async logAuthEvent(input: {
    actorId: string;
    actorName: string;
    actorEmail: string;
    action: ActivityLog["action"];
    description: string;
    targetType?: ActivityLog["targetType"];
    targetId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ActivityLog> {
    return this.activityLogRepository.create({
      actorId: input.actorId,
      actorName: input.actorName,
      actorEmail: input.actorEmail,
      action: input.action,
      description: input.description,
      targetType: input.targetType ?? "auth",
      targetId: input.targetId,
      metadata: input.metadata
    });
  }

  async logSystemEvent(input: {
    actorId?: string;
    actorName?: string;
    actorEmail?: string;
    action: ActivityLog["action"];
    description: string;
    targetType?: ActivityLog["targetType"];
    targetId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ActivityLog> {
    return this.activityLogRepository.create({
      actorId: input.actorId ?? null,
      actorName: input.actorName ?? null,
      actorEmail: input.actorEmail ?? null,
      action: input.action,
      description: input.description,
      targetType: input.targetType ?? "system",
      targetId: input.targetId,
      metadata: input.metadata
    });
  }
}
