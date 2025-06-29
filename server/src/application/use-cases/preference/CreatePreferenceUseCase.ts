import { IPreferenceRepository } from "../../../domain/repositories/IPreferenceRepository";
import { CreatePreferenceRequest } from "../../dtos/preferences/CreatePreferenceRequest";
import { Preference } from "../../../domain/entities/Preference";
import { BadRequestError } from "../../../shared/errors";

export class CreatePreferenceUseCase {
  constructor(private readonly preferenceRepository: IPreferenceRepository) {}

  async execute(request: CreatePreferenceRequest): Promise<void> {
    if (!request.category) {
      throw new BadRequestError("Category is required");
    }

    const existingPreference = await this.preferenceRepository.findByCategory(
      request.category
    );
    if (existingPreference && !existingPreference.getIsDeleted()) {
      throw new BadRequestError("Category already exists");
    }

    const preference = new Preference(null, request.category);
    await this.preferenceRepository.create(preference);
  }
}
