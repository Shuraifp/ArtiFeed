import { Preference } from "../entities/Preference";

export interface IPreferenceRepository {
  findAll(): Promise<Preference[]>;
  findByCategory(category: string): Promise<Preference | null>;
  create(preference: Preference): Promise<Preference>;
  update(preference: Preference): Promise<Preference>;
  delete(category: string): Promise<void>;
}