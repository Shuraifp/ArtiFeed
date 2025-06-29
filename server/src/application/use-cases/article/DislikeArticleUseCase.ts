import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IArticleReactionRepository } from "../../../domain/repositories/IArticleReactionRepository";
import { DislikeArticleRequest } from "../../dtos/article/DislikeArticleRequest";
import { ArticleResponse } from "../../dtos/article/ArticleResponse";
import { NotFoundError, BadRequestError } from "../../../shared/errors";
import { StatusMessages } from "../../../shared/constants/StatusMessages";
import { ReactionStatus } from "../../../shared/constants/ReactionStatus";
import { ArticleReaction } from "../../../domain/entities/ArticleReaction";
import logger from "../../../shared/utils/logger";

export class DislikeArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly userRepository: IUserRepository,
    private readonly articleReactionRepository: IArticleReactionRepository
  ) {}

  async execute(request: DislikeArticleRequest): Promise<ArticleResponse> {
    const res = await this.articleRepository.findById(request.articleId);
    if (!res) {
      throw new NotFoundError(StatusMessages.NOT_FOUND);
    }

    const { article, authorName } = res;
    const existingReaction =
      await this.articleReactionRepository.findByUserAndArticle(
        request.userId,
        request.articleId
      );

    if (existingReaction?.getStatus() === ReactionStatus.Dislike) {
      const deleted = await this.articleReactionRepository.delete(
        existingReaction.getId()
      );
      if (deleted) {
        article.undoDislike();
        await this.articleRepository.update(article);
      }
      return ArticleResponse.fromEntity(article, authorName);
    }

    if (existingReaction?.getStatus() === ReactionStatus.Like) {
      existingReaction.setStatus(ReactionStatus.Dislike);
      await this.articleReactionRepository.update(existingReaction);
      article.dislike();
      article.undoLike();
      await this.articleRepository.update(article);
      await this.userRepository.decrementLikes(article.getAuthor());
    } else {
      const reaction = new ArticleReaction(
        null,
        request.userId,
        request.articleId,
        ReactionStatus.Dislike
      );
      await this.articleReactionRepository.create(reaction);
      article.dislike();
      article.incrementViews();
      await this.articleRepository.update(article);
      await this.userRepository.decrementLikes(article.getAuthor());
      await this.userRepository.incrementViews(article.getAuthor());
    }

    logger.info(
      `User ${request.userId.toString()} disliked article ${request.articleId.toString()}`
    );
    return ArticleResponse.fromEntity(article, authorName);
  }
}
