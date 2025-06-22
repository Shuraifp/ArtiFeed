import mongoose, { Document, Schema } from "mongoose";

export interface IArticle extends Document {
  title: string;
  body: string;
  category: string;
  image?: string;
  views: number;
  readTime?: number;
  tags?: string[];
  publishedAt: string;
  likes: number;
  dislikes: number;
  isBlocked: boolean;
  author: string;
}

const ArticleSchema: Schema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  views: { type: Number, default: 0 },
  readTime: { type: Number },
  tags: [{ type: String }],
  publishedAt: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  author: { type: String, required: true, ref: "User" },
});

export default mongoose.model<IArticle>("Article", ArticleSchema);