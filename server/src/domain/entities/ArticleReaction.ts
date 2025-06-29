import { ArticleId } from "../value-objects/ArticleId";
import { UserId } from "../value-objects/UserId";
import { ReactionStatus } from "../../shared/constants/ReactionStatus";
import { ArticleReactionId } from "../value-objects/ArticleReactionId";
import { NotFoundError } from "../../shared/errors";

export class ArticleReaction {
  constructor(
    private readonly id: ArticleReactionId | null,
    private readonly userId: UserId,
    private readonly articleId: ArticleId,
    private status: ReactionStatus
  ) {}

  getId(): ArticleReactionId {
    if (!this.id)
      throw new NotFoundError("Article Reaction ID has not been assigned yet.");
    return this.id;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getArticleId(): ArticleId {
    return this.articleId;
  }

  getStatus(): ReactionStatus {
    return this.status;
  }

  setStatus(status: ReactionStatus): void {
    this.status = status;
  }
}
