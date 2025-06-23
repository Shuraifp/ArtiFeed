import { IArticle } from "../models/article";
import { ArticleDto } from "../dto/articleDTO";

export const toArticleDto = (article: IArticle): ArticleDto => ({
  id: article._id!.toString(),
  title: article.title,
  body: article.body,
  category: article.category,
  image: article.image,
  views: article.views,
  readTime: article.readTime,
  tags: article.tags,
  publishedAt: article.publishedAt,
  likes: article.likes,
  dislikes: article.dislikes,
  isBlocked: article.isBlocked,
  author: article.author,
});
