import { Response } from "express";
import { OK, UNAUTHORIZED } from "../../constants/http-status";
import { AuthenticatedRequest } from "../../types/express.types";
import { ApiError } from "../../utils/api-error";
import { ApiSuccessResponse, sendSuccess } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { IActivityLogService } from "./activity.interface";
import { ActivityLog, GetActivitiesQueryDto } from "./activity.types";

export class ActivityController {
  constructor(private readonly activityLogService: IActivityLogService) {}

  getMyActivities = asyncHandler(
    async (
      req: AuthenticatedRequest<
        Record<string, never>,
        ApiSuccessResponse<ActivityLog[]>
      >,
      res: Response<ApiSuccessResponse<ActivityLog[]>>
    ) => {
      if (!req.user) {
        throw new ApiError(UNAUTHORIZED, "Unauthorized request");
      }

      const activities = await this.activityLogService.getMyActivities(
        req.user.id,
        req.query as unknown as GetActivitiesQueryDto
      );

      return sendSuccess(res, OK, "Activity logs fetched", activities);
    }
  );

  getRecentActivities = asyncHandler(
    async (
      req: AuthenticatedRequest<
        Record<string, never>,
        ApiSuccessResponse<ActivityLog[]>
      >,
      res: Response<ApiSuccessResponse<ActivityLog[]>>
    ) => {
      const limit = Number(req.query.limit ?? 10);
      const activities = await this.activityLogService.getRecentActivities(limit);

      return sendSuccess(res, OK, "Recent activities fetched", activities);
    }
  );
}
