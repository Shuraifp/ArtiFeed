export interface ArticleDto {
  id: string;
  title: string;
  body: string;
  category: string;
  image?: string;
  views: number;
  readTime?: number;
  tags?: string[];
  publishedAt: string;
  likes: number;
  dislikes: number;
  isBlocked: boolean;
  author: string;
}
