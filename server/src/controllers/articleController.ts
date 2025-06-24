import { NextFunction, Request, Response } from "express";
import Article from "../models/article";
import User from "../models/user";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/errors";
import { HttpStatus } from "../utils/HTTPStatusCodes";
import { StatusMessages } from "../utils/HTTPStatusMessages";
import { toArticleDto } from "../mappers/articleMapper";
import ArticleReaction, { ReactionStatus } from "../models/articleReaction";

export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, body, category, image, tags } = req.body;
    const userId = req.user?.id;

    if (!title || !body || !category) {
      throw new BadRequestError("Title, body, and category are required");
    }

    const wordsPerMinute = 200;
    const wordCount = body.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);

    const article = await Article.create({
      title,
      body,
      category,
      image,
      tags,
      readTime,
      publishedAt: new Date(),
      author: userId,
    });

    await User.findByIdAndUpdate(userId, { $inc: { totalArticles: 1 } });

    res.status(HttpStatus.CREATED).json({
      article: toArticleDto(article),
      message: StatusMessages.SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};

export const getArticles = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  const skip = (page - 1) * limit;

  const user = await User.findById(userId).select(
    "blockedArticles preferences"
  );
  if (!user) throw new NotFoundError(StatusMessages.NOT_FOUND);

  const filter = {
    isBlocked: false,
    category: { $in: user.preferences },
    _id: { $nin: user.blockedArticles },
  };

  const [articles, total] = await Promise.all([
    Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Article.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    articles: await Promise.all(articles.map(toArticleDto)),
    totalPages,
    currentPage: page,
    totalArticles: total,
    message: StatusMessages.SUCCESS,
  });
};

export const getArticlesForAdmin = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  const skip = (page - 1) * limit;

  const [articles, total] = await Promise.all([
    Article.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Article.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    articles: await Promise.all(articles.map(toArticleDto)),
    totalPages,
    currentPage: page,
    totalArticles: total,
    message: StatusMessages.SUCCESS,
  });
};

export const getUserArticles = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  const skip = (page - 1) * limit;

  const [articles, total] = await Promise.all([
    Article.find({ author: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Article.countDocuments({ userId }),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    articles: await Promise.all(articles.map(toArticleDto)),
    totalPages,
    currentPage: page,
    totalArticles: total,
    message: StatusMessages.SUCCESS,
  });
};

export const getArticleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);
  res.json({ article, message: StatusMessages.SUCCESS });
};

export const updateArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, body, category, image, tags } = req.body;
  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);
  if (article.author !== (req as any).user.id)
    throw new ForbiddenError(StatusMessages.PERMISSION_DENIED);

  const wordsPerMinute = 200;
  const wordCount = body.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);

  article.title = title || article.title;
  article.body = body || article.body;
  article.category = category || article.category;
  article.image = image || article.image;
  article.readTime = readTime;
  article.tags = tags || article.tags;
  await article.save();
  res.json({ article, message: StatusMessages.SUCCESS });
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);
  if (article.author !== (req as any).user.id)
    throw new ForbiddenError(StatusMessages.PERMISSION_DENIED);
  await Article.findByIdAndDelete(id);
  await User.findByIdAndUpdate(article.author, { $inc: { totalArticles: -1 } });
  res.json({ message: StatusMessages.SUCCESS });
};

export const likeArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);

  const existing = await ArticleReaction.findOne({ userId, articleId: id });

  let updatedArticle;

  if (existing?.status === ReactionStatus.Like) {
    res.status(400).json({ message: "Already liked" });
    return;
  }

  if (existing?.status === ReactionStatus.Dislike) {
    existing.status = ReactionStatus.Like;
    await existing.save();
    updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        $inc: { likes: 1, dislikes: -1 },
      },
      { new: true }
    );
    await User.findByIdAndUpdate(article.author, {
      $inc: { totalLikes: 1 },
    });
  } else {
    await ArticleReaction.create({
      userId,
      articleId: id,
      status: ReactionStatus.Like,
    });
    updatedArticle = await Article.findByIdAndUpdate(
      id,
      { $inc: { likes: 1, views: 1 } },
      { new: true }
    );
    await User.findByIdAndUpdate(article.author, {
      $inc: { totalLikes: 1, totalViews: 1 },
    });
  }
  res.json({
    article: await toArticleDto(updatedArticle!),
    message: "Article liked successfully",
  });
};

export const dislikeArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);

  const existing = await ArticleReaction.findOne({ userId, articleId: id });

  let updatedArticle;

  if (existing?.status === ReactionStatus.Dislike) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: "Already disliked" });
    return;
  }

  if (existing?.status === ReactionStatus.Like) {
    existing.status = ReactionStatus.Dislike;
    await existing.save();
    updatedArticle = await Article.findByIdAndUpdate(
      id,
      { $inc: { dislikes: 1, likes: -1 } },
      { new: true }
    );
    await User.findByIdAndUpdate(article.author, {
      $inc: { totalLikes: -1 },
    });
  } else {
    await ArticleReaction.create({
      userId,
      articleId: id,
      status: ReactionStatus.Dislike,
    });
    updatedArticle = await Article.findByIdAndUpdate(
      id,
      { $inc: { dislikes: 1, views: 1 } },
      { new: true }
    );
    await User.findByIdAndUpdate(article.author, {
      $inc: { totalLikes: -1, totalViews: 1 },
    });
  }
  res.json({
    article: await toArticleDto(updatedArticle!),
    message: "Article liked successfully",
  });
};

export const blockArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);
  await User.findByIdAndUpdate(userId, { $addToSet: { blockedArticles: id } });
  res.json({ message: "Article blocked", articleId: id });
};

export const adminBlockArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);
  article.isBlocked = true;
  await article.save();
  res.json({ article, message: "Article blocked by admin" });
};
