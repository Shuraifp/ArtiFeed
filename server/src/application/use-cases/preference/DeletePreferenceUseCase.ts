import { IPreferenceRepository } from "../../../domain/repositories/IPreferenceRepository";
import { DeletePreferenceRequest } from "../../dtos/preferences/DeletePreferenceRequest";
import { NotFoundError } from "../../../shared/errors";

export class DeletePreferenceUseCase {
  constructor(private readonly preferenceRepository: IPreferenceRepository) {}

  async execute(request: DeletePreferenceRequest): Promise<void> {
    const preference = await this.preferenceRepository.findByCategory(request.category);
    if (!preference || preference.getIsDeleted()) {
      throw new NotFoundError("Preference category not found");
    }

    preference.delete();
    await this.preferenceRepository.update(preference);
  }
}