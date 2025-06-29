import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { PasswordHasher } from "../../../domain/services/PasswordHasher";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import { LoginRequest } from "../../dtos/auth/LoginRequest";
import { AuthResponse } from "../../dtos/auth/AuthResponse";
import { BadRequestError, UnauthorizedError } from "../../../shared/errors";
import { Roles } from "../../../shared/constants/Roles";

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService
  ) {}

  async execute(request: LoginRequest, role: Roles): Promise<AuthResponse> {
    if (!request.password || (!request.email && !request.phone)) {
      throw new BadRequestError("Password and either email or phone are required");
    }

    let user;
    if (request.email) {
      user = await this.userRepository.findByEmail(request.email);
    } else if (request.phone) {
      user = await this.userRepository.findByPhone(request.phone);
    }

    if (!user || user.getRole() !== role) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await this.passwordHasher.compare(request.password, user.getPassword());
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const payload = {
      id: user.getId().toString(),
      email: user.getEmail(),
      role: user.getRole(),
    };
    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    return AuthResponse.fromEntity(user, accessToken, refreshToken);
  }
}