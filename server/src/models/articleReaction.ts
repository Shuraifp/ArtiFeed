import mongoose, { Document, Schema } from "mongoose";

export interface IArticleReaction extends Document {
  userId: string;
  articleId: string;
  status: string;
}

export enum ReactionStatus {
  Like = "like",
  Dislike = "dislike",
}

const ArticleReactionSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    status: { type: String, enum: ReactionStatus, required: true },
  },
  { timestamps: true }
);

ArticleReactionSchema.index({ userId: 1, articleId: 1 }, { unique: true });

export default mongoose.model<IArticleReaction>(
  "ArticleReaction",
  ArticleReactionSchema
);
