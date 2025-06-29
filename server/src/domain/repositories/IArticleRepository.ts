import { Article } from "../entities/Article";
import { ArticleId } from "../value-objects/ArticleId";
import { UserId } from "../value-objects/UserId";
import { Pagination } from "./IUserRepository";

export interface ArticleFilters {
  category?: string[];
  isBlocked?: boolean;
  blockedArticles?: ArticleId[];
}

export interface IArticleRepository {
  create(article: Article): Promise<Article>;
  findById(id: ArticleId): Promise<{ article: Article; authorName: string } | null>;
  findByAuthor(authorId: UserId, pagination: Pagination): Promise<Article[]>;
  findByFilters(
    filters: ArticleFilters,
    pagination: Pagination
  ): Promise<{ article: Article; authorName: string }[]>;
  update(article: Article): Promise<Article>;
  delete(id: ArticleId): Promise<void>;
  count(filters?: ArticleFilters): Promise<number>;
  countAll(): Promise<number>;
  getTotalViews(): Promise<number>;
  getCategoryDistribution(): Promise<Record<string, number>>;
  findAllArticles(): Promise<Article[]>;
}
