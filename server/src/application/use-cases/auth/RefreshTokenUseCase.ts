import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { JwtService, JwtPayload } from "../../../infrastructure/auth/JwtService";
import { RefreshTokenRequest } from "../../dtos/auth/RefreshTokenRequest";
import { AuthResponse } from "../../dtos/auth/AuthResponse";
import { UnauthorizedError , NotFoundError} from "../../../shared/errors";
import { UserId } from "../../../domain/value-objects/UserId";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(request: RefreshTokenRequest): Promise<AuthResponse> {
    if (!request.refreshToken) {
      throw new UnauthorizedError("Refresh token is required");
    }

    const decoded = this.jwtService.verifyToken(request.refreshToken);
    if (!decoded || decoded.role !== request.role) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const user = await this.userRepository.findById(new UserId(decoded.id));
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const payload: JwtPayload = {
      id: user.getId().toString(),
      email: user.getEmail(),
      role: user.getRole(),
    };
    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    return AuthResponse.fromEntity(user, accessToken, refreshToken);
  }
}