import { ArticleReaction } from "../../../../domain/entities/ArticleReaction";
import { IArticleReactionRepository } from "../../../../domain/repositories/IArticleReactionRepository";
import { ArticleId } from "../../../../domain/value-objects/ArticleId";
import { ArticleReactionId } from "../../../../domain/value-objects/ArticleReactionId";
import { UserId } from "../../../../domain/value-objects/UserId";
import { ReactionStatus } from "../../../../shared/constants/ReactionStatus";
import ArticleReactionModel, { IArticleReaction } from "../models/ArticleReactionModel";

export class MongoArticleReactionRepository implements IArticleReactionRepository {
  async count(): Promise<number> {
    return ArticleReactionModel.countDocuments();
  }

  async countLikes(): Promise<number> {
    return ArticleReactionModel.countDocuments({ status: ReactionStatus.Like });
  }

  async findByUserAndArticle(userId: UserId, articleId: ArticleId): Promise<ArticleReaction | null> {
    const doc = await ArticleReactionModel.findOne({
      userId: userId.toString(),
      articleId: articleId.toString(),
    });
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async create(reaction: ArticleReaction): Promise<ArticleReaction> {
    const doc = new ArticleReactionModel({
      userId: reaction.getUserId().toString(),
      articleId: reaction.getArticleId().toString(),
      status: reaction.getStatus(),
    });
    const savedDoc = await doc.save();
    return this.toDomain(savedDoc);
  }
  
  async delete(reactionId: ArticleReactionId): Promise<boolean> {
    const deleted = await ArticleReactionModel.findOneAndDelete({_id: reactionId})
    return !!deleted;
  }

  async update(reaction: ArticleReaction): Promise<ArticleReaction> {
    const updatedDoc = await ArticleReactionModel.findOneAndUpdate(
      {
        userId: reaction.getUserId().toString(),
        articleId: reaction.getArticleId().toString(),
      },
      { status: reaction.getStatus() },
      { new: true }
    );
    if (!updatedDoc) throw new Error("Reaction not found");
    return this.toDomain(updatedDoc);
  }

  private toDomain(doc: IArticleReaction): ArticleReaction {
    return new ArticleReaction(
      new ArticleReactionId(doc._id!.toString()),
      new UserId(doc.userId),
      new ArticleId(doc.articleId),
      doc.status
    );
  }
}