import {
  ArticleFilters,
  IArticleRepository,
} from "../../../domain/repositories/IArticleRepository";
import {
  IUserRepository,
  Pagination,
} from "../../../domain/repositories/IUserRepository";
import { ArticleId } from "../../../domain/value-objects/ArticleId";
import { UserId } from "../../../domain/value-objects/UserId";
import { NotFoundError } from "../../../shared/errors";
import { ArticleResponse } from "../../dtos/article/ArticleResponse";
import { GetArticlesRequest } from "../../dtos/article/GetArticlesRequest";

export class GetArticlesUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: GetArticlesRequest): Promise<{
    articles: ArticleResponse[];
    totalPages: number;
    currentPage: number;
    totalArticles: number;
  }> {
    const user = await this.userRepository.findById(new UserId(request.userId));
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const filters: ArticleFilters = {
      isBlocked: false,
      category: user.getPreferences(),
      blockedArticles: user.getBlockedArticles().map((id) => new ArticleId(id)),
    };

    const pagination: Pagination = { page: request.page, limit: request.limit };

    const [articleResults, total] = await Promise.all([
      this.articleRepository.findByFilters(filters, pagination),
      this.articleRepository.count(filters),
    ]);

    const totalPages = Math.ceil(total / request.limit);

    const articleResponses = articleResults.map(({ article, authorName }) =>
      ArticleResponse.fromEntity(article, authorName)
    );

    return {
      articles: articleResponses,
      totalPages,
      currentPage: request.page,
      totalArticles: total,
    };
  }
}
