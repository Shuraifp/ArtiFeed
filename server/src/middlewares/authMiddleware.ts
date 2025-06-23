import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import User from "../models/user";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import { HttpStatus } from "../utils/HTTPStatusCodes";
import { StatusMessages } from "../utils/HTTPStatusMessages";
import { Roles } from "../types/type";

export interface JWTPayload {
  id: string;
  email: string;
  role: Roles;
}

declare module "express" {
  export interface Request {
    user?: JWTPayload;
  }
}

export const authenticateJWT = (requiredRole: "user" | "admin") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    let token: string | undefined;
    if (requiredRole === "admin") {
      token = req.cookies.adminAccessToken;
    } else if (requiredRole === "user") {
      token = req.cookies.userAccessToken;
    }

    if (!token) {
      throw new UnauthorizedError(StatusMessages.TOKEN_REQUIRED);
    }

    const secretKey = process.env.JWT_SECRET || "secret";

    jwt.verify(token, secretKey, async (err: VerifyErrors | null, decoded: any) => {
      if (err) throw new ForbiddenError(StatusMessages.INVALID_TOKEN);

      const user = decoded as JWTPayload;
      const dbUser = await User.findById(user.id).select("isBlocked role");

      if (!dbUser) throw new UnauthorizedError(StatusMessages.USER_NOT_FOUND);
      if (dbUser.isBlocked) throw new UnauthorizedError(StatusMessages.USER_BLOCKED);
      if (dbUser.role !== requiredRole) throw new ForbiddenError(StatusMessages.PERMISSION_DENIED);

      req.user = user;
      next();
    });
  };
};