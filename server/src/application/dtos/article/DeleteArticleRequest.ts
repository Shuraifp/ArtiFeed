import { ArticleId } from "../../../domain/value-objects/ArticleId";
import { UserId } from "../../../domain/value-objects/UserId";

export class DeleteArticleRequest {
  constructor(
    public readonly articleId: ArticleId,
    public readonly userId: UserId
  ) {}

  static fromHttp(req: any): DeleteArticleRequest {
    return new DeleteArticleRequest(
      new ArticleId(req.params.articleId),
      new UserId(req.user.id)
    );
  }
}