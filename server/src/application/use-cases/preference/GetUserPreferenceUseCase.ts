import { Preference } from "../../../domain/entities/Preference";
import { IPreferenceRepository } from "../../../domain/repositories/IPreferenceRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserId } from "../../../domain/value-objects/UserId";
import { GetUserPreferenceRequest } from "../../dtos/preferences/GetUserPreferenceRequest";

export class GetUserPreferencesUseCase {
  constructor(private readonly userRepository : IUserRepository) {}

  async execute(request:GetUserPreferenceRequest): Promise<string[] | undefined> {
    const user = await this.userRepository.findById(request.userId);
    return user?.getPreferences()
  }
}