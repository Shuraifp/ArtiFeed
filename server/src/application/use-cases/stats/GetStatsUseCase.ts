import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { StatsResponse } from "../../dtos/stats/StatsResponse";
import { Roles } from "../../../shared/constants/Roles";
import logger from "../../../shared/utils/logger";

export class GetStatsUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly articleRepository: IArticleRepository
  ) {}

  async execute(): Promise<StatsResponse> {
    const [totalUsers, totalArticles, totalViews, averageLikes, averageDislikes, categoryDistribution] = await Promise.all([
      this.userRepository.count(Roles.User),
      this.articleRepository.countAll(),
      this.articleRepository.getTotalViews(),
      this.articleRepository.getAverageLikes(),
      this.articleRepository.getAverageDislikes(),
      this.articleRepository.getCategoryDistribution(),
    ]);

    logger.info("Computed article stats using aggregation");

    return StatsResponse.fromData(
      totalUsers,
      totalArticles,
      totalViews,
      averageLikes,
      averageDislikes,
      categoryDistribution
    );
  }
}