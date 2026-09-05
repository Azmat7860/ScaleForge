import { IAnalyticsRepository, IAnalyticsService } from "./analytics.interface";
import { AdminAnalyticsOverview } from "./analytics.types";

export class AnalyticsService implements IAnalyticsService {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async getAdminOverview(days: number): Promise<AdminAnalyticsOverview> {
    return this.analyticsRepository.getAdminOverview(days);
  }
}
