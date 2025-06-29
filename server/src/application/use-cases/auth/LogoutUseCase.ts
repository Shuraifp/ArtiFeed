import { Roles } from "../../../shared/constants/Roles";

export class LogoutUseCase {
  async execute(role: Roles): Promise<{ accessTokenKey: string; refreshTokenKey: string }> {
    const accessTokenKey = role === Roles.User ? "userAccessToken" : "adminAccessToken";
    const refreshTokenKey = role === Roles.User ? "userRefreshToken" : "adminRefreshToken";
    return { accessTokenKey, refreshTokenKey };
  }
}