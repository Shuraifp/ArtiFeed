import { IArticle } from "../models/article";
import { ArticleDto } from "../dto/articleDTO";
import user from "../models/user";

export const toArticleDto = async (article: IArticle): Promise<ArticleDto> => {
  const authorName = await user
    .findById(article.author)
    .select("firstName lastName");
  return {
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
    author: `${authorName?.firstName}${" "}${authorName?.lastName}`,
  };
};
