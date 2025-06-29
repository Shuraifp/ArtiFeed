import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserResponse } from "../../dtos/user/UserResponse";
import { UserId } from "../../../domain/value-objects/UserId";
import { NotFoundError } from "../../../shared/errors";

export class ToggleBlockUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: UserId): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    user.toggleBlock();
    const updatedUser = await this.userRepository.update(user);
    return UserResponse.fromEntity(updatedUser);
  }
}