import { User } from "../../../domain/entities/User";
import { UserId } from "../../../domain/value-objects/UserId";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { PasswordHasher } from "../../../domain/services/PasswordHasher";
import { UserResponse } from "../../dtos/user/UserResponse";
import { CreateUserRequest } from "../../dtos/user/CreateUserRequest";
import { BadRequestError } from "../../../shared/errors";

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(request: CreateUserRequest): Promise<UserResponse> {
    if (!request.email || !request.password || !request.firstName || !request.lastName || !request.dob) {
      throw new BadRequestError("Email, password, firstName, lastName, and dob are required");
    }

    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const hashedPassword = await this.passwordHasher.hash(request.password);
    const user = new User(
      new UserId(Date.now().toString()), // Use UUID in production
      request.email,
      request.phone,
      hashedPassword,
      request.firstName,
      request.lastName,
      request.dob,
      request.preferences
    );

    const savedUser = await this.userRepository.create(user);
    return UserResponse.fromEntity(savedUser);
  }
}