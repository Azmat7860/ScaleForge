import { Router } from "express";
import { activityRouter } from "../modules/activity/activity.routes";
import { analyticsRouter } from "../modules/analytics/analytics.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { notificationRouter } from "../modules/notification/notification.routes";
import { accountRouter } from "../modules/user/account.routes";
import { userRouter } from "../modules/user/user.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/", accountRouter);
apiRouter.use("/activities", activityRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/users", userRouter);

export { apiRouter };
