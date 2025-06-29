import { UserId } from "../../../domain/value-objects/UserId";

export class CreateArticleRequest {
  constructor(
    public readonly title: string,
    public readonly body: string,
    public readonly category: string,
    public readonly authorId: UserId,
    public readonly tags: string[] = [],
    public readonly image?: string
  ) {}

  static fromHttp(req: any): CreateArticleRequest {
    return new CreateArticleRequest(
      req.body.title,
      req.body.body,
      req.body.category,
      new UserId(req.user.id),
      req.body.tags,
      req.body.image
    );
  }
}