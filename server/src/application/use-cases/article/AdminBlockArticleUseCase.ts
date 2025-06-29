import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { AdminBlockArticleRequest } from "../../dtos/article/AdminBlockArticleRequest";
import { ArticleResponse } from "../../dtos/article/ArticleResponse";
import { NotFoundError } from "../../../shared/errors";
import { StatusMessages } from "../../../shared/constants/StatusMessages";
import logger from "../../../shared/utils/logger";

export class AdminBlockArticleUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  async execute(request: AdminBlockArticleRequest): Promise<ArticleResponse> {
    const res = await this.articleRepository.findById(request.articleId);
    if (!res) {
      throw new NotFoundError(StatusMessages.NOT_FOUND);
    }

    const { article, authorName } = res;

    article.block();
    const updatedArticle = await this.articleRepository.update(article);
    logger.info(`Admin blocked article ${request.articleId.toString()}`);
    return ArticleResponse.fromEntity(updatedArticle, authorName);
  }
}