import { Preference } from "../../../domain/entities/Preference";
import { IPreferenceRepository } from "../../../domain/repositories/IPreferenceRepository";

export class GetPreferencesUseCase {
  constructor(private readonly preferenceRepository: IPreferenceRepository) {}

  async execute(): Promise<string[]> {
    const preferences = await this.preferenceRepository.findAll();
    return preferences
      .filter((p: Preference) => !p.getIsDeleted())
      .map((p: Preference) => p.getCategory());
  }
}