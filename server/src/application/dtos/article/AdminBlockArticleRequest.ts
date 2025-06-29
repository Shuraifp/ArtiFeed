import { ArticleId } from "../../../domain/value-objects/ArticleId";

export class AdminBlockArticleRequest {
  constructor(public readonly articleId: ArticleId) {}

  static fromHttp(req: any): AdminBlockArticleRequest {
    return new AdminBlockArticleRequest(new ArticleId(req.params.articleId));
  }
}