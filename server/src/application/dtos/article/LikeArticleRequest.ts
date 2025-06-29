import { ArticleId } from "../../../domain/value-objects/ArticleId";
import { UserId } from "../../../domain/value-objects/UserId";

export class LikeArticleRequest {
  constructor(
    public readonly articleId: ArticleId,
    public readonly userId: UserId
  ) {}

  static fromHttp(req: any): LikeArticleRequest {
    return new LikeArticleRequest(
      new ArticleId(req.params.articleId),
      new UserId(req.user.id)
    );
  }
}