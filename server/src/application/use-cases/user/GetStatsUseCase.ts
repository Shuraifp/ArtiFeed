import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { IArticleReactionRepository } from "../../../domain/repositories/IArticleReactionRepository";
import { Roles } from "../../../shared/constants/Roles";

export class GetStatsUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly articleRepository: IArticleRepository,
    private readonly articleReactionRepository: IArticleReactionRepository
  ) {}

  async execute(): Promise<{
    activeUsers: number;
    totalArticles: number;
    satisfactionRate: string;
  }> {
    const [activeUsers, totalArticles, totalReactions, likedReactions] = await Promise.all([
      this.userRepository.count(Roles.User),
      this.articleRepository.count({ isBlocked: false }),
      this.articleReactionRepository.count(),
      this.articleReactionRepository.countLikes(),
    ]);

    const satisfactionRate = totalReactions > 0 ? Math.round((likedReactions / totalReactions) * 100) : 0;

    return {
      activeUsers,
      totalArticles,
      satisfactionRate: `${satisfactionRate}%`,
    };
  }
}