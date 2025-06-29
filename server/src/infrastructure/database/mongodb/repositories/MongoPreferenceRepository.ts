import { Preference } from "../../../../domain/entities/Preference";
import { IPreferenceRepository } from "../../../../domain/repositories/IPreferenceRepository";
import { PreferenceId } from "../../../../domain/value-objects/PreferenceId";
import PreferenceModel, { IPreference } from "../models/PreferenceModel";

export class MongoPreferenceRepository implements IPreferenceRepository {
  async findAll(): Promise<Preference[]> {
    const docs = await PreferenceModel.find();
    return docs.map(this.toDomain);
  }

  async findByCategory(category: string): Promise<Preference | null> {
    const doc = await PreferenceModel.findOne({ category });
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async create(preference: Preference): Promise<Preference> {
    const doc = new PreferenceModel({
      category: preference.getCategory(),
      isDeleted: preference.getIsDeleted(),
    });
    const savedDoc = await doc.save();
    return this.toDomain(savedDoc);
  }

  async update(preference: Preference): Promise<Preference> {
    const updatedDoc = await PreferenceModel.findOneAndUpdate(
      { category: preference.getCategory() },
      { isDeleted: preference.getIsDeleted() },
      { new: true }
    );
    if (!updatedDoc) throw new Error("Preference not found");
    return this.toDomain(updatedDoc);
  }

  async delete(category: string): Promise<void> {
    await PreferenceModel.deleteOne({ category });
  }

  private toDomain(doc: IPreference): Preference {
    return new Preference(
      new PreferenceId(doc._id!.toString()),
      doc.category,
      doc.isDeleted
    );
  }
}
