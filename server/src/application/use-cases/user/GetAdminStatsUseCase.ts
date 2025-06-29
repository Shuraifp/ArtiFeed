import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { IArticleReactionRepository } from "../../../domain/repositories/IArticleReactionRepository";
import { Roles } from "../../../shared/constants/Roles";

export class GetAdminStatsUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly articleRepository: IArticleRepository,
    private readonly articleReactionRepository: IArticleReactionRepository
  ) {}

  async execute(): Promise<{
    totalUsers: number;
    totalArticles: number;
    totalViews: number;
    averageLikes: number;
    averageDislikes: number;
    categoryDistribution: Record<string, number>;
  }> {
    const [totalUsers, totalArticles, totalViews, reactions, categoryDistribution] = await Promise.all([
      this.userRepository.count(Roles.User),
      this.articleRepository.countAll(),
      this.articleRepository.getTotalViews(),
      this.articleReactionRepository.count(),
      this.articleRepository.getCategoryDistribution(),
    ]);

    let averageLikes = 0;
    let averageDislikes = 0;
    
    const reactionAggregation = await this.articleReactionRepository.count(); 
    
    averageLikes = await this.articleReactionRepository.countLikes();
    averageDislikes = reactionAggregation - averageLikes;

    return {
      totalUsers,
      totalArticles,
      totalViews,
      averageLikes,
      averageDislikes,
      categoryDistribution,
    };
  }
}