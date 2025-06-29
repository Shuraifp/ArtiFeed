import { Request, Response, NextFunction } from "express";
import { GetStatsUseCase } from "../../application/use-cases/stats/GetStatsUseCase";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { StatusMessages } from "../../shared/constants/StatusMessages";

export class StatsController {
  constructor(private readonly getStatsUseCase: GetStatsUseCase) {}

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.getStatsUseCase.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  }
}
