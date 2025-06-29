import mongoose, { Document, Schema } from "mongoose";
import { ReactionStatus } from "../../../../shared/constants/ReactionStatus";

export interface IArticleReaction extends Document {
  userId: string;
  articleId: string;
  status: ReactionStatus;
}

const ArticleReactionSchema: Schema = new Schema({
  userId: { type: String, required: true, ref: "User" },
  articleId: { type: String, required: true, ref: "Article" },
  status: { type: String, enum: Object.values(ReactionStatus), required: true },
});

export default mongoose.model<IArticleReaction>("ArticleReaction", ArticleReactionSchema);