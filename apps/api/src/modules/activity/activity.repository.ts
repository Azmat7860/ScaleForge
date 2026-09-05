import { HydratedDocument, Types } from "mongoose";
import { IActivityLogRepository } from "./activity.interface";
import { ActivityLogModel, ActivityLogModelShape } from "./activity.model";
import { ActivityLog, CreateActivityLogInput } from "./activity.types";

export class ActivityLogRepository implements IActivityLogRepository {
  async create(input: CreateActivityLogInput): Promise<ActivityLog> {
    const activity = await ActivityLogModel.create({
      actorId: input.actorId ? new Types.ObjectId(input.actorId) : null,
      actorName: input.actorName ?? null,
      actorEmail: input.actorEmail ?? null,
      action: input.action,
      description: input.description,
      targetType: input.targetType,
      targetId: input.targetId ?? null,
      metadata: input.metadata ?? {}
    });

    return this.toDomain(activity);
  }

  async findByActorId(actorId: string, limit: number): Promise<ActivityLog[]> {
    const activities = await ActivityLogModel.find({
      actorId: new Types.ObjectId(actorId)
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    return activities.map((activity) => this.toDomain(activity));
  }

  async findRecent(limit: number): Promise<ActivityLog[]> {
    const activities = await ActivityLogModel.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    return activities.map((activity) => this.toDomain(activity));
  }

  private toDomain(activity: HydratedDocument<ActivityLogModelShape>): ActivityLog {
    return {
      id: activity._id.toString(),
      actorId: activity.actorId?.toHexString() ?? null,
      actorName: activity.actorName,
      actorEmail: activity.actorEmail,
      action: activity.action,
      description: activity.description,
      targetType: activity.targetType,
      targetId: activity.targetId,
      metadata: activity.metadata,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt
    };
  }
}
