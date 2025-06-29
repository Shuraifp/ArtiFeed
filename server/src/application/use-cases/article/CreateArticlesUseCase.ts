import { Article } from "../../../domain/entities/Article";
import { ReadTimeCalculator } from "../../../domain/services/ReadTimeCalculator";
import { IArticleRepository } from "../../../domain/repositories/IArticleRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ArticleResponse } from "../../dtos/article/ArticleResponse";
import { CreateArticleRequest } from "../../dtos/article/CreateArticleRequest";
import { BadRequestError } from "../../../shared/errors";

export class CreateArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly userRepository: IUserRepository,
    private readonly readTimeCalculator: ReadTimeCalculator
  ) {}

  async execute(request: CreateArticleRequest): Promise<ArticleResponse> {
    if (!request.title || !request.body || !request.category) {
      throw new BadRequestError("Title, body, and category are required");
    }

    const readTime = this.readTimeCalculator.calculate(request.body);
    const article = new Article(
      null,
      request.title,
      request.body,
      request.category,
      request.authorId,
      0,
      0,
      0,
      false,
      new Date(),
      readTime,
      request.tags,
      request.image
    );

    const savedArticle = await this.articleRepository.create(article);
    await this.userRepository.incrementArticleCount(request.authorId);

    const authorName = "Unknown Author";
    return ArticleResponse.fromEntity(savedArticle, authorName);
  }
}