import { User } from "../../../domain/entities/User";
import { UserId } from "../../../domain/value-objects/UserId";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { PasswordHasher } from "../../../domain/services/PasswordHasher";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import { SignupRequest } from "../../dtos/auth/SignupRequest";
import { AuthResponse } from "../../dtos/auth/AuthResponse";
import { BadRequestError } from "../../../shared/errors";
import { Roles } from "../../../shared/constants/Roles";

export class SignupUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService
  ) {}

  async execute(request: SignupRequest): Promise<AuthResponse> {
    if (!request.email || !request.password || !request.firstName || !request.lastName || !request.dob) {
      throw new BadRequestError("Email, password, firstName, lastName, and dob are required");
    }

    const existingUser = await Promise.any([
      this.userRepository.findByEmail(request.email),
      this.userRepository.findByPhone(request.phone),
    ]).catch(() => null);
    if (existingUser) {
      throw new BadRequestError("User already exists with this email or phone");
    }

    const hashedPassword = await this.passwordHasher.hash(request.password);
    const user = new User(
      null,
      request.email,
      request.phone,
      hashedPassword,
      request.firstName,
      request.lastName,
      request.dob,
      request.preferences,
      0,
      0,
      0,
      false,
      Roles.User
    );

    const savedUser = await this.userRepository.create(user);
    const payload = {
      id: savedUser.getId().toString(),
      email: savedUser.getEmail(),
      role: Roles.User,
    };
    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    return AuthResponse.fromEntity(savedUser, accessToken, refreshToken);
  }
}