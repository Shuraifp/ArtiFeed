import { ArticleId } from "../../../domain/value-objects/ArticleId";

export class AdminToggleBlockArticleRequest {
  constructor(public readonly articleId: ArticleId) {}

  static fromHttp(req: any): AdminToggleBlockArticleRequest {
    return new AdminToggleBlockArticleRequest(new ArticleId(req.params.articleId));
  }
}