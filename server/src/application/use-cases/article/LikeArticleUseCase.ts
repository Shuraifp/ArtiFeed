import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IArticleReactionRepository } from "../../../domain/repositories/IArticleReactionRepository";
import { ArticleResponse } from "../../dtos/article/ArticleResponse";
import { NotFoundError } from "../../../shared/errors";
import { StatusMessages } from "../../../shared/constants/StatusMessages";
import { ReactionStatus } from "../../../shared/constants/ReactionStatus";
import { ArticleReaction } from "../../../domain/entities/ArticleReaction";
import { LikeArticleRequest } from "../../dtos/article/LikeArticleRequest";
import logger from "../../../shared/utils/logger";

export class LikeArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly userRepository: IUserRepository,
    private readonly articleReactionRepository: IArticleReactionRepository
  ) {}

  async execute(request: LikeArticleRequest): Promise<ArticleResponse> {
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

    if (existingReaction?.getStatus() === ReactionStatus.Like) {
      console.log(existingReaction.getId());
      const deleted = await this.articleReactionRepository.delete(
        existingReaction.getId()
      );
      if (deleted) {
        article.undoLike();
        await this.articleRepository.update(article);
      }
      return ArticleResponse.fromEntity(article, authorName);
    }

    if (existingReaction?.getStatus() === ReactionStatus.Dislike) {
      existingReaction.setStatus(ReactionStatus.Like);
      await this.articleReactionRepository.update(existingReaction);
      article.like();
      article.undoDislike();
      await this.articleRepository.update(article);
      await this.userRepository.incrementLikes(article.getAuthor());
    } else {
      const reaction = new ArticleReaction(
        null,
        request.userId,
        request.articleId,
        ReactionStatus.Like
      );
      await this.articleReactionRepository.create(reaction);
      article.like();
      article.incrementViews();
      await this.articleRepository.update(article);
      await this.userRepository.incrementLikes(article.getAuthor());
      await this.userRepository.incrementViews(article.getAuthor());
    }

    logger.info(
      `User ${request.userId.toString()} liked article ${request.articleId.toString()}`
    );
    return ArticleResponse.fromEntity(article, authorName);
  }
}
