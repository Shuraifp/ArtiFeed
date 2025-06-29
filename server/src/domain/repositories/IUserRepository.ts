import { User } from "../entities/User";
import { UserId } from "../value-objects/UserId";
import { Roles } from "../../shared/constants/Roles";
import { ArticleId } from "../value-objects/ArticleId";

export interface UserPreferences {
  preferences: string[];
  blockedArticles: string[];
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findAll(pagination: Pagination, role: Roles): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: UserId): Promise<void>;
  count(role: Roles): Promise<number>;
  getUserPreferences(userId: UserId): Promise<UserPreferences>;
  incrementArticleCount(userId: UserId): Promise<void>;
  decrementArticleCount(userId: UserId): Promise<void>;
  incrementLikes(userId: UserId): Promise<void>;
  decrementLikes(userId: UserId): Promise<void>;
  incrementViews(userId: UserId): Promise<void>;
  blockArticle(userId: UserId, articleId: ArticleId): Promise<void>;
  addPreference(userId: UserId, category: string): Promise<void>;
  removePreference(userId: UserId, category: string): Promise<void>;
}