import {
  ArticleFilters,
  IArticleRepository,
} from "../../../domain/repositories/IArticleRepository";
import { Pagination } from "../../../domain/repositories/IUserRepository";
import { ArticleResponse } from "../../dtos/article/ArticleResponse";
import { GetAllArticlesRequest } from "../../dtos/article/GetAllArticlesRequest";

export class GetArticlesForAdminUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  async execute(request: GetAllArticlesRequest): Promise<{
    articles: ArticleResponse[];
    totalPages: number;
    currentPage: number;
    totalArticles: number;
  }> {
    const filters = {};

    const pagination: Pagination = { page: request.page, limit: request.limit };

    const [articleResults, total] = await Promise.all([
      this.articleRepository.findAllArticles(pagination),
      this.articleRepository.count(),
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
