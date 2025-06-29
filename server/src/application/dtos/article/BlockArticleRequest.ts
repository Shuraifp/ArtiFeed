import { ArticleId } from "../../../domain/value-objects/ArticleId";
import { UserId } from "../../../domain/value-objects/UserId";

export class BlockArticleRequest {
  constructor(
    public readonly articleId: ArticleId,
    public readonly userId: UserId
  ) {}

  static fromHttp(req: any): BlockArticleRequest {
    return new BlockArticleRequest(
      new ArticleId(req.params.articleId),
      new UserId(req.user.id)
    );
  }
}