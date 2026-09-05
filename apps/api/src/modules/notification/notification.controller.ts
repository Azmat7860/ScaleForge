import { Response } from "express";
import { OK, UNAUTHORIZED } from "../../constants/http-status";
import { AuthenticatedRequest } from "../../types/express.types";
import { ApiError } from "../../utils/api-error";
import { ApiSuccessResponse, sendSuccess } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { INotificationService } from "./notification.interface";
import {
  GetNotificationsQueryDto,
  Notification,
  NotificationListResponse
} from "./notification.types";

export class NotificationController {
  constructor(private readonly notificationService: INotificationService) {}

  getMyNotifications = asyncHandler(
    async (
      req: AuthenticatedRequest<
        Record<string, never>,
        ApiSuccessResponse<NotificationListResponse>
      >,
      res: Response<ApiSuccessResponse<NotificationListResponse>>
    ) => {
      if (!req.user) {
        throw new ApiError(UNAUTHORIZED, "Unauthorized request");
      }

      const notifications = await this.notificationService.getMyNotifications(
        req.user.id,
        req.query as unknown as GetNotificationsQueryDto
      );

      return sendSuccess(res, OK, "Notifications fetched", notifications);
    }
  );

  markAsRead = asyncHandler(
    async (
      req: AuthenticatedRequest<
        { id: string },
        ApiSuccessResponse<Notification>
      >,
      res: Response<ApiSuccessResponse<Notification>>
    ) => {
      if (!req.user) {
        throw new ApiError(UNAUTHORIZED, "Unauthorized request");
      }

      const notification = await this.notificationService.markAsRead(
        req.user.id,
        req.params.id
      );

      return sendSuccess(res, OK, "Notification marked as read", notification);
    }
  );
}
