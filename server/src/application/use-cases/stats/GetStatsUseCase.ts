import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { StatsResponse } from "../../dtos/stats/StatsResponse";
import { Roles } from "../../../shared/constants/Roles";

export class GetStatsUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly articleRepository: IArticleRepository
  ) {}

  async execute(): Promise<StatsResponse> {
    const articles = await this.articleRepository.findAllArticles();
    const totalUsers = await this.userRepository.count(Roles.User);

    const totalArticles = articles.length;
    const totalViews = articles.reduce((sum, article) => sum + article.getViews(), 0);
    const averageLikes = totalArticles ? articles.reduce((sum, article) => sum + article.getLikes(), 0) / totalArticles : 0;
    const averageDislikes = totalArticles ? articles.reduce((sum, article) => sum + article.getDislikes(), 0) / totalArticles : 0;

    const categoryDistribution = articles.reduce((dist: Record<string, number>, article) => {
      dist[article.getCategory()] = (dist[article.getCategory()] || 0) + 1;
      return dist;
    }, {});

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