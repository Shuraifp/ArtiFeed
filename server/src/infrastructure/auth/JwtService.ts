import jwt, { SignOptions } from "jsonwebtoken";
import { ACCESS_EXPIRY, REFRESH_EXPIRY } from "../../shared/constants/TokenExpiry";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export class JwtService {
  private readonly secret: string = process.env.JWT_SECRET || "secret";

  generateToken(payload: JwtPayload, duration: SignOptions["expiresIn"]): string {
    return jwt.sign(payload, this.secret, { expiresIn: duration });
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  generateAccessToken(payload: JwtPayload): string {
    return this.generateToken(payload, ACCESS_EXPIRY);
  }

  generateRefreshToken(payload: JwtPayload): string {
    return this.generateToken(payload, REFRESH_EXPIRY);
  }
}