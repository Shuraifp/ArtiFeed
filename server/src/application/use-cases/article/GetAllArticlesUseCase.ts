import {
  ArticleFilters,
  IArticleRepository,
} from "../../../domain/repositories/IArticleRepository";
import { Pagination } from "../../../domain/repositories/IUserRepository";
import { ArticleResponse } from "../../dtos/article/ArticleResponse";
import { GetAllArticlesRequest } from "../../dtos/article/GetAllArticlesRequest";
import { GetArticlesRequest } from "../../dtos/article/GetArticlesRequest";

export class GetAllArticlesUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  async execute(request: GetAllArticlesRequest): Promise<{
    articles: ArticleResponse[];
    totalPages: number;
    currentPage: number;
    totalArticles: number;
  }> {
    const filters: ArticleFilters = {
      isBlocked: false,
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
