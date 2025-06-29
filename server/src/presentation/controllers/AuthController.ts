import { Request, Response, NextFunction } from "express";
import { SignupUseCase } from "../../application/use-cases/auth/SignupUseCase";
import { LoginUseCase } from "../../application/use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "../../application/use-cases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/RefreshTokenUseCase";
import { SignupRequest } from "../../application/dtos/auth/SignupRequest";
import { LoginRequest } from "../../application/dtos/auth/LoginRequest";
import { RefreshTokenRequest } from "../../application/dtos/auth/RefreshTokenRequest";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { StatusMessages } from "../../shared/constants/StatusMessages";
import { Roles } from "../../shared/constants/Roles";
import { ACCESS_EXPIRY, REFRESH_EXPIRY } from "../../shared/constants/TokenExpiry";

export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const request = SignupRequest.fromHttp(req);
      const response = await this.signupUseCase.execute(request);
      this.setCookies(res, response.accessToken, response.refreshToken, Roles.User);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { user: { id: response.id, name: response.name } },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request = LoginRequest.fromHttp(req);
      const response = await this.loginUseCase.execute(request, Roles.User);
      this.setCookies(res, response.accessToken, response.refreshToken, Roles.User);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { user: { id: response.id, name: response.name } },
      });
    } catch (error) {
      next(error);
    }
  }

  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const request = LoginRequest.fromHttp(req);
      const response = await this.loginUseCase.execute(request, Roles.Admin);
      this.setCookies(res, response.accessToken, response.refreshToken, Roles.Admin);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { user: { id: response.id, name: response.name } },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessTokenKey, refreshTokenKey } = await this.logoutUseCase.execute(Roles.User);
      this.clearCookies(res, accessTokenKey, refreshTokenKey);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

  async adminLogout(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessTokenKey, refreshTokenKey } = await this.logoutUseCase.execute(Roles.Admin);
      this.clearCookies(res, accessTokenKey, refreshTokenKey);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, role: Roles, next: NextFunction) {
    try {
      const request = RefreshTokenRequest.fromHttp(req, role);
      const response = await this.refreshTokenUseCase.execute(request);
      this.setCookies(res, response.accessToken, response.refreshToken, role);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { user: { id: response.id, name: response.name } },
      });
    } catch (error) {
      next(error);
    }
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string, role: Roles) {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie(role === Roles.User ? "userAccessToken" : "adminAccessToken", accessToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: ACCESS_EXPIRY * 1000,
    });
    res.cookie(role === Roles.User ? "userRefreshToken" : "adminRefreshToken", refreshToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: REFRESH_EXPIRY * 1000,
    });
  }

  private clearCookies(res: Response, accessTokenKey: string, refreshTokenKey: string) {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie(accessTokenKey, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });
    res.clearCookie(refreshTokenKey, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });
  }
}