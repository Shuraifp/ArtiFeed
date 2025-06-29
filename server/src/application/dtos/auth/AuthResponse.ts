import { User } from "../../../domain/entities/User";

export interface AuthResponseDto {
  id: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export class AuthResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly accessToken: string,
    public readonly refreshToken: string
  ) {}

  static fromEntity(user: User, accessToken: string, refreshToken: string): AuthResponse {
    return new AuthResponse(
      user.getId().toString(),
      `${user.getFirstName()} ${user.getLastName()}`,
      accessToken,
      refreshToken
    );
  }
}