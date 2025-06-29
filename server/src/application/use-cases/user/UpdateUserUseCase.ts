import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserResponse } from "../../dtos/user/UserResponse";
import { UpdateUserRequest } from "../../dtos/user/UpdateUserRequest";
import { NotFoundError, BadRequestError } from "../../../shared/errors";
import { PasswordHasher } from "../../../domain/services/PasswordHasher";

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(request: UpdateUserRequest): Promise<UserResponse> {
    const user = await this.userRepository.findById(request.userId);
    if (!user) throw new NotFoundError("User not found");

    if (request.email) {
      const existingUser = await this.userRepository.findByEmail(request.email);
      if (existingUser && existingUser.getId().toString() !== request.userId.toString()) {
        throw new BadRequestError("Email already in use");
      }
    }

    if (request.phone) {
      const existingUser = await this.userRepository.findByPhone(request.phone);
      if (existingUser && existingUser.getId().toString() !== request.userId.toString()) {
        throw new BadRequestError("Phone already in use");
      }
    }

    let hashedPassword = user.getPassword();
    if (request.password) {
      hashedPassword = await this.passwordHasher.hash(request.password);
    }

    user.update({
      email: request.email,
      phone: request.phone,
      firstName: request.firstName,
      lastName: request.lastName,
      dob: request.dob,
      preferences: request.preferences,
      password: hashedPassword,
    });

    const updatedUser = await this.userRepository.update(user);
    return UserResponse.fromEntity(updatedUser);
  }
}