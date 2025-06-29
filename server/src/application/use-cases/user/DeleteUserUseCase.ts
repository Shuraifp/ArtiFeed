import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserId } from "../../../domain/value-objects/UserId";
import { NotFoundError } from "../../../shared/errors";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: UserId): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    await this.userRepository.delete(userId);
  }
}