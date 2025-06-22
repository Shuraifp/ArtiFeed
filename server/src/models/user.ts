import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  phone: string;
  password: string; 
  firstName: string;
  lastName: string;
  dob: string;
  preferences: string[];
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  isBlocked: boolean;
  role: "user" | "admin";
  blockedArticles: string[];
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: String, required: true },
  preferences: [{ type: String }],
  totalArticles: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  blockedArticles: [{ type: String, ref: "Article" }],
});

export default mongoose.model<IUser>("User", UserSchema);