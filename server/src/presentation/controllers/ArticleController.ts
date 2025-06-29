import { Request, Response, NextFunction } from "express";
import { CreateArticleUseCase } from "../../application/use-cases/article/CreateArticlesUseCase";
import { GetArticlesUseCase } from "../../application/use-cases/article/GetArticlesUseCase";
import { CreateArticleRequest } from "../../application/dtos/article/CreateArticleRequest";
import { GetArticlesRequest } from "../../application/dtos/article/GetArticlesRequest";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { StatusMessages } from "../../shared/constants/StatusMessages";
import { GetArticlesbyUserUseCase } from "../../application/use-cases/article/GetArticlesbyUserUseCase";
import { UpdateArticleRequest } from "../../application/dtos/article/UpdateArticleRequest";
import { UpdateArticleUseCase } from "../../application/use-cases/article/UpdateArticleUseCase";
import { GetAllArticlesRequest } from "../../application/dtos/article/GetAllArticlesRequest";
import { GetAllArticlesUseCase } from "../../application/use-cases/article/GetAllArticlesUseCase";
import { DeleteArticleUseCase } from "../../application/use-cases/article/DeleteArticleUseCase";
import { LikeArticleUseCase } from "../../application/use-cases/article/LikeArticleUseCase";
import { DislikeArticleUseCase } from "../../application/use-cases/article/DislikeArticleUseCase";
import { BlockArticleUseCase } from "../../application/use-cases/article/BlockArticleUseCase";
import { AdminBlockArticleUseCase } from "../../application/use-cases/article/AdminBlockArticleUseCase";
import { DeleteArticleRequest } from "../../application/dtos/article/DeleteArticleRequest";
import { LikeArticleRequest } from "../../application/dtos/article/LikeArticleRequest";
import { DislikeArticleRequest } from "../../application/dtos/article/DislikeArticleRequest";
import { BlockArticleRequest } from "../../application/dtos/article/BlockArticleRequest";
import { AdminBlockArticleRequest } from "../../application/dtos/article/AdminBlockArticleRequest";

export class ArticleController {
  constructor(
    private readonly createArticleUseCase: CreateArticleUseCase,
    private readonly updateArticleUseCase: UpdateArticleUseCase,
    private readonly getArticlesUseCase: GetArticlesUseCase,
    private readonly getArticlesbyUserUseCase: GetArticlesbyUserUseCase,
    private readonly getAllArticlesUseCase: GetAllArticlesUseCase,
    private readonly deleteArticleUseCase: DeleteArticleUseCase,
    private readonly likeArticleUseCase: LikeArticleUseCase,
    private readonly dislikeArticleUseCase: DislikeArticleUseCase,
    private readonly blockArticleUseCase: BlockArticleUseCase,
    private readonly adminBlockArticleUseCase: AdminBlockArticleUseCase
  ) {}

  async createArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const request = CreateArticleRequest.fromHttp(req);
      const response = await this.createArticleUseCase.execute(request);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { article: response },
      });
    } catch (error) {
      next(error);
    }
  }

  async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const request = GetArticlesRequest.fromHttp(req);
      const response = await this.getArticlesUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getAllArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const request = GetAllArticlesRequest.fromHttp(req);
      const response = await this.getAllArticlesUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getArticlesbyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const request = GetArticlesRequest.fromHttp(req);
      const response = await this.getArticlesbyUserUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const request = UpdateArticleRequest.fromHttp(req);
      const response = await this.updateArticleUseCase.execute(request);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: StatusMessages.SUCCESS,
        data: { article: response },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const request = DeleteArticleRequest.fromHttp(req);
      await this.deleteArticleUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: StatusMessages.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

  async likeArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const request = LikeArticleRequest.fromHttp(req);
      const response = await this.likeArticleUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Article liked successfully",
        data: { article: response },
      });
    } catch (error) {
      next(error);
    }
  }

  async dislikeArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const request = DislikeArticleRequest.fromHttp(req);
      const response = await this.dislikeArticleUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Article disliked successfully",
        data: { article: response },
      });
    } catch (error) {
      next(error);
    }
  }

  async blockArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const request = BlockArticleRequest.fromHttp(req);
      await this.blockArticleUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Article blocked",
        data: { articleId: request.articleId.toString() },
      });
    } catch (error) {
      next(error);
    }
  }

  async adminBlockArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const request = AdminBlockArticleRequest.fromHttp(req);
      const response = await this.adminBlockArticleUseCase.execute(request);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Article blocked by admin",
        data: { article: response },
      });
    } catch (error) {
      next(error);
    }
  }
}