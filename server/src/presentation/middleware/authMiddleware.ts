import { Request, Response, NextFunction } from "express";
import { JwtService, JwtPayload } from "../../infrastructure/auth/JwtService";
import { UnauthorizedError, ForbiddenError } from "../../shared/errors";
import { StatusMessages } from "../../shared/constants/StatusMessages";
import { Roles } from "../../shared/constants/Roles";
import UserModel from "../../infrastructure/database/mongodb/models/UserModel";

declare module "express" {
  export interface Request {
    user?: JwtPayload;
  }
}

export const authenticateJWT = (requiredRole: Roles) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    let token: string | undefined;
    if (requiredRole === Roles.Admin) {
      token = req.cookies.adminAccessToken;
    } else if (requiredRole === Roles.User) {
      token = req.cookies.userAccessToken;
    }

    if (!token) {
      throw new UnauthorizedError(StatusMessages.TOKEN_REQUIRED);
    }

    const jwtService = new JwtService();
    const decoded = jwtService.verifyToken(token);
    if (!decoded) {
      throw new ForbiddenError(StatusMessages.INVALID_TOKEN);
    }

    try {
      const user = decoded as JwtPayload;
      const dbUser = await UserModel.findById(user.id).select("isBlocked role");
      if (!dbUser)
        return next(new UnauthorizedError(StatusMessages.USER_NOT_FOUND));
      if (dbUser.isBlocked)
        return next(new UnauthorizedError(StatusMessages.USER_BLOCKED));
      if (dbUser.role !== requiredRole)
        return next(new ForbiddenError(StatusMessages.PERMISSION_DENIED));

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
