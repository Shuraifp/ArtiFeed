import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { AdminToggleBlockArticleRequest } from "../../dtos/article/AdminToggleBlockArticleRequest";
import { ArticleResponse } from "../../dtos/article/ArticleResponse";
import { NotFoundError } from "../../../shared/errors";
import { StatusMessages } from "../../../shared/constants/StatusMessages";
import logger from "../../../shared/utils/logger";

export class AdminToggleBlockArticleUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  async execute(
    request: AdminToggleBlockArticleRequest
  ): Promise<ArticleResponse> {
    const res = await this.articleRepository.findById(request.articleId);
    if (!res) {
      throw new NotFoundError(StatusMessages.NOT_FOUND);
    }

    const { article, authorName } = res;

    if (article.getIsBlocked()) {
      article.unBlock();
    } else {
      article.block();
    }
    const updatedArticle = await this.articleRepository.update(article);
    logger.info(`Admin blocked article ${request.articleId.toString()}`);
    return ArticleResponse.fromEntity(updatedArticle, authorName);
  }
}
