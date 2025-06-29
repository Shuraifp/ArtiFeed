import { ArticleId } from "../../../domain/value-objects/ArticleId";
import { UserId } from "../../../domain/value-objects/UserId";

export class DislikeArticleRequest {
  constructor(
    public readonly articleId: ArticleId,
    public readonly userId: UserId
  ) {}

  static fromHttp(req: any): DislikeArticleRequest {
    return new DislikeArticleRequest(
      new ArticleId(req.params.articleId),
      new UserId(req.user.id)
    );
  }
}