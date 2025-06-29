import { ArticleId } from "../../../domain/value-objects/ArticleId";
import { UserId } from "../../../domain/value-objects/UserId";

export class UpdateArticleRequest {
  constructor(
    public readonly articleId: ArticleId,
    public readonly title: string,
    public readonly body: string,
    public readonly category: string,
    public readonly authorId: UserId,
    public readonly tags: string[] = [],
    public readonly image?: string
  ) {}

  static fromHttp(req: any): UpdateArticleRequest {
    return new UpdateArticleRequest(
      new ArticleId(req.params.articleId),
      req.body.title,
      req.body.body,
      req.body.category,
      new UserId(req.user.id),
      req.body.tags,
      req.body.image
    );
  }
}