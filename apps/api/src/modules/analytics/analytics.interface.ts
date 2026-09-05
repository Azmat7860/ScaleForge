import { AdminAnalyticsOverview } from "./analytics.types";

export interface IAnalyticsRepository {
  getAdminOverview(days: number): Promise<AdminAnalyticsOverview>;
}

export interface IAnalyticsService {
  getAdminOverview(days: number): Promise<AdminAnalyticsOverview>;
}
