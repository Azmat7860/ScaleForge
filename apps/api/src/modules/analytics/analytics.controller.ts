import { Request, Response } from "express";
import { OK } from "../../constants/http-status";
import { ApiSuccessResponse, sendSuccess } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { IAnalyticsService } from "./analytics.interface";
import { AdminAnalyticsOverview } from "./analytics.types";

export class AnalyticsController {
  constructor(private readonly analyticsService: IAnalyticsService) {}

  getOverview = asyncHandler(
    async (
      req: Request,
      res: Response<ApiSuccessResponse<AdminAnalyticsOverview>>
    ) => {
      const days = Number(req.query.days ?? 7);
      const overview = await this.analyticsService.getAdminOverview(days);

      return sendSuccess(res, OK, "Admin analytics fetched", overview);
    }
  );
}
