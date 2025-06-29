import { Roles } from "../../../shared/constants/Roles";

export class RefreshTokenRequest {
  constructor(
    public readonly refreshToken: string,
    public readonly role: Roles
  ) {}

  static fromHttp(req: any, role: Roles): RefreshTokenRequest {
    const token = role === Roles.User ? req.cookies.userRefreshToken : req.cookies.adminRefreshToken;
    return new RefreshTokenRequest(token, role);
  }
}