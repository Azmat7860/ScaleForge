import { ActivityController } from "./activity.controller";
import { ActivityLogRepository } from "./activity.repository";
import { ActivityLogService } from "./activity.service";

const activityLogRepository = new ActivityLogRepository();
const activityLogService = new ActivityLogService(activityLogRepository);
const activityController = new ActivityController(activityLogService);

export { activityLogRepository, activityLogService, activityController };
