import { Request, Response, NextFunction } from "express";
import { CreateUserUseCase } from "../../application/use-cases/user/CreateUserUseCase";
import { GetUsersUseCase } from "../../application/use-cases/user/GetUsersUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/user/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../application/use-cases/user/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../application/use-cases/user/DeleteUserUseCase";
import { ToggleBlockUserUseCase } from "../../application/use-cases/user/ToggleBlockUserUseCase";
import { GetStatsUseCase } from "../../application/use-cases/user/GetStatsUseCase";
import { GetAdminStatsUseCase } from "../../application/use-cases/user/GetAdminStatsUseCase";
import { CreateUserRequest } from "../../application/dtos/user/CreateUserRequest";
import { UpdateUserRequest } from "../../application/dtos/user/UpdateUserRequest";
import { GetUsersRequest } from "../../application/dtos/user/GetUsersRequest";
import { UserId } from "../../domain/value-objects/UserId";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { StatusMessages } from "../../shared/constants/StatusMessages";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly toggleBlockUserUseCase: ToggleBlockUserUseCase,
    private readonly getStatsUseCase: GetStatsUseCase,
    private readonly getAdminStatsUseCase: GetAdminStatsUseCase
  ) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const request = CreateUserRequest.fromHttp(req);
      const response = await this.createUserUseCase.execute(request);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { user: response },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const request = GetUsersRequest.fromHttp(req);
      const response = await this.getUsersUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = new UserId(req.user!.id);
      const response = await this.getUserByIdUseCase.execute(userId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { user: response },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const request = UpdateUserRequest.fromHttp(req);
      const response = await this.updateUserUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { user: response },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = new UserId(req.params.id);
      await this.deleteUserUseCase.execute(userId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleBlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = new UserId(req.params.id);
      const response = await this.toggleBlockUserUseCase.execute(userId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "User block status toggled",
        data: { user: response },
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.getStatsUseCase.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { stats: response },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdminStats(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.getAdminStatsUseCase.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { stats: response },
      });
    } catch (error) {
      next(error);
    }
  }
}
