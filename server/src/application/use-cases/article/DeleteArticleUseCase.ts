import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { DeleteArticleRequest } from "../../dtos/article/DeleteArticleRequest";
import { NotFoundError, ForbiddenError } from "../../../shared/errors";
import { StatusMessages } from "../../../shared/constants/StatusMessages";

export class DeleteArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: DeleteArticleRequest): Promise<void> {
    const res = await this.articleRepository.findById(request.articleId);
    if (!res) {
      throw new NotFoundError(StatusMessages.NOT_FOUND);
    }

    const { article } = res;

    if (article.getAuthor().toString() !== request.userId.toString()) {
      throw new ForbiddenError(StatusMessages.PERMISSION_DENIED);
    }

    await this.articleRepository.delete(request.articleId);
    await this.userRepository.decrementArticleCount(request.userId);
  }
}