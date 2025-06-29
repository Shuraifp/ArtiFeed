import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { BlockArticleRequest } from "../../dtos/article/BlockArticleRequest";
import { NotFoundError } from "../../../shared/errors";
import { StatusMessages } from "../../../shared/constants/StatusMessages";
import logger from "../../../shared/utils/logger";

export class BlockArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: BlockArticleRequest): Promise<void> {
    const article = await this.articleRepository.findById(request.articleId);
    if (!article) {
      throw new NotFoundError(StatusMessages.NOT_FOUND);
    }

    await this.userRepository.blockArticle(request.userId, request.articleId);
    logger.info(`User ${request.userId.toString()} blocked article ${request.articleId.toString()}`);
  }
}