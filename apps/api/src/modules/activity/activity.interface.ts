import {
  ActivityLog,
  CreateActivityLogInput,
  GetActivitiesQueryDto
} from "./activity.types";

export interface IActivityLogRepository {
  create(input: CreateActivityLogInput): Promise<ActivityLog>;
  findByActorId(actorId: string, limit: number): Promise<ActivityLog[]>;
  findRecent(limit: number): Promise<ActivityLog[]>;
}

export interface IActivityLogService {
  create(input: CreateActivityLogInput): Promise<ActivityLog>;
  getMyActivities(
    userId: string,
    query: GetActivitiesQueryDto
  ): Promise<ActivityLog[]>;
  getRecentActivities(limit: number): Promise<ActivityLog[]>;
  logAuthEvent(input: {
    actorId: string;
    actorName: string;
    actorEmail: string;
    action: ActivityLog["action"];
    description: string;
    targetType?: ActivityLog["targetType"];
    targetId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ActivityLog>;
  logSystemEvent(input: {
    actorId?: string;
    actorName?: string;
    actorEmail?: string;
    action: ActivityLog["action"];
    description: string;
    targetType?: ActivityLog["targetType"];
    targetId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ActivityLog>;
}
