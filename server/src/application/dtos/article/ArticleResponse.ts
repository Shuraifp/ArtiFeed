import { Article } from "../../../domain/entities/Article";

export interface ArticleDto {
  id: string;
  title: string;
  body: string;
  category: string;
  image?: string;
  views: number;
  readTime: number;
  tags: string[];
  publishedAt: string;
  likes: number;
  dislikes: number;
  isBlocked: boolean;
  author: {
    _id: string;
    name: string;
  };
}

export class ArticleResponse {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly body: string,
    public readonly category: string,
    public readonly authorName: string,
    public readonly authorId: string,
    public readonly views: number,
    public readonly likes: number,
    public readonly dislikes: number,
    public readonly isBlocked: boolean,
    public readonly publishedAt: string,
    public readonly readTime: number,
    public readonly tags: string[],
    public readonly image?: string
  ) {}

  static fromEntity(article: Article, authorName: string): ArticleResponse {
    return new ArticleResponse(
      article.getId().toString(),
      article.getTitle(),
      article.getBody(),
      article.getCategory(),
      authorName,
      article.getAuthor().toString(),
      article.getViews(),
      article.getLikes(),
      article.getDislikes(),
      article.getIsBlocked(),
      article.getPublishedAt().toISOString(),
      article.getReadTime().value(),
      article.getTags(),
      article.getImage()
    );
  }
}
