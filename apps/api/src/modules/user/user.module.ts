import { CacheService } from "../../cache/cache.service";
import { activityLogService } from "../activity/activity.module";
import { AuthRepository } from "../auth/auth.repository";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const cacheService = new CacheService();
const userService = new UserService(
  userRepository,
  cacheService,
  authRepository,
  activityLogService
);
const userController = new UserController(userService);

export { userRepository, authRepository, cacheService, userService, userController };
