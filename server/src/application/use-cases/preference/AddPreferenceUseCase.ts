import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPreferenceRepository } from "../../../domain/repositories/IPreferenceRepository";
import { AddPreferenceRequest } from "../../dtos/preferences/AddPreferenceRequest";
import { BadRequestError, NotFoundError } from "../../../shared/errors";

export class AddPreferenceUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly preferenceRepository: IPreferenceRepository
  ) {}

  async execute(request: AddPreferenceRequest): Promise<void> {
    if (!request.category) {
      throw new BadRequestError("Category is required");
    }

    const preference = await this.preferenceRepository.findByCategory(request.category);
    if (!preference || preference.getIsDeleted()) {
      throw new NotFoundError("Preference category not found");
    }

    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.getPreferences().includes(request.category)) {
      throw new BadRequestError("Category already in user preferences");
    }

    await this.userRepository.addPreference(request.userId, request.category);
  }
}