import mongoose, { Document, Schema } from "mongoose";

export interface IPreference extends Document {
  category: string;
  isDeleted?: boolean;
}

const PreferenceSchema: Schema = new Schema({
  category: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false }
});

export default mongoose.model<IPreference>("Preference", PreferenceSchema);