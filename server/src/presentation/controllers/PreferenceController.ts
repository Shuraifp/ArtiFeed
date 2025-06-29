import { Request, Response, NextFunction } from "express";
import { GetPreferencesUseCase } from "../../application/use-cases/preference/GetPreferencesUseCase";
import { AddPreferenceUseCase } from "../../application/use-cases/preference/AddPreferenceUseCase";
import { RemovePreferenceUseCase } from "../../application/use-cases/preference/RemovePreferenceUseCase";
import { DeletePreferenceUseCase } from "../../application/use-cases/preference/DeletePreferenceUseCase";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { StatusMessages } from "../../shared/constants/StatusMessages";
import { AddPreferenceRequest } from "../../application/dtos/preferences/AddPreferenceRequest";
import { RemovePreferenceRequest } from "../../application/dtos/preferences/RemovePreferenceRequest";
import { CreatePreferenceRequest } from "../../application/dtos/preferences/CreatePreferenceRequest";
import { DeletePreferenceRequest } from "../../application/dtos/preferences/DeletePreferenceRequest";
import { CreatePreferenceUseCase } from "../../application/use-cases/preference/CreatePreferenceUseCase";
import { GetUserPreferencesUseCase } from "../../application/use-cases/preference/GetUserPreferenceUseCase";
import { GetUserPreferenceRequest } from "../../application/dtos/preferences/GetUserPreferenceRequest";

export class PreferenceController {
  constructor(
    private readonly getPreferencesUseCase: GetPreferencesUseCase,
    private readonly getUserPreferencesUseCase : GetUserPreferencesUseCase,
    private readonly addPreferenceUseCase: AddPreferenceUseCase,
    private readonly removePreferenceUseCase: RemovePreferenceUseCase,
    private readonly createPreferenceUseCase: CreatePreferenceUseCase,
    private readonly deletePreferenceUseCase: DeletePreferenceUseCase
  ) {}

  async getAllPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const preferences = await this.getPreferencesUseCase.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { preferences },
      });
    } catch (error) {
      next(error);
    }
  }
 
  async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const request = GetUserPreferenceRequest.fromHttp(req)
      const preferences = await this.getPreferencesUseCase.execute();
      const userPreferences = await this.getUserPreferencesUseCase.execute(request)
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { preferences, userPreferences },
      });
    } catch (error) {
      next(error);
    }
  }

  async addPreference(req: Request, res: Response, next: NextFunction) {
    try {
      const request = AddPreferenceRequest.fromHttp(req);
      await this.addPreferenceUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

  async removePreference(req: Request, res: Response, next: NextFunction) {
    try {
      const request = RemovePreferenceRequest.fromHttp(req);
      await this.removePreferenceUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPreference(req: Request, res: Response, next: NextFunction) {
    try {
      const request = CreatePreferenceRequest.fromHttp(req);
      await this.createPreferenceUseCase.execute(request);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: StatusMessages.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePreference(req: Request, res: Response, next: NextFunction) {
    try {
      const request = DeletePreferenceRequest.fromHttp(req);
      await this.deletePreferenceUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }
}