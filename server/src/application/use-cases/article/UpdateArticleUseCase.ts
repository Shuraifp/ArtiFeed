import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { UpdateArticleRequest } from "../../dtos/article/UpdateArticleRequest";
import { ArticleResponse } from "../../dtos/article/ArticleResponse";
import { NotFoundError } from "../../../shared/errors";
import { StatusMessages } from "../../../shared/constants/StatusMessages";

export class UpdateArticleUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  async execute(request: UpdateArticleRequest): Promise<ArticleResponse> {
    const res = await this.articleRepository.findById(request.articleId);
    if (!res) {
      throw new NotFoundError(StatusMessages.NOT_FOUND);
    }

    const { article, authorName } = res;
    const existingArticle = article;

    existingArticle.update(
      request.title,
      request.body,
      request.category,
      request.image,
      request.tags
    );

    const updated = await this.articleRepository.update(existingArticle);

    return ArticleResponse.fromEntity(updated, authorName);
  }
}
