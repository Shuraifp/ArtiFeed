import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserResponse } from "../../dtos/user/UserResponse";
import { UserId } from "../../../domain/value-objects/UserId";
import { NotFoundError } from "../../../shared/errors";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: UserId): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    return UserResponse.fromEntity(user);
  }
}