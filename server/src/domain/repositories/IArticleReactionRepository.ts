import { ArticleReaction } from "../entities/ArticleReaction";
import { UserId } from "../value-objects/UserId";
import { ArticleId } from "../value-objects/ArticleId";
import { ArticleReactionId } from "../value-objects/ArticleReactionId";

export interface IArticleReactionRepository {
  findByUserAndArticle(userId: UserId, articleId: ArticleId): Promise<ArticleReaction | null>;
  create(reaction: ArticleReaction): Promise<ArticleReaction>;
  update(reaction: ArticleReaction): Promise<ArticleReaction>;
  delete(reactionId: ArticleReactionId): Promise<boolean>;
  count(): Promise<number>;
  countLikes(): Promise<number>;
}