import { Request, Response } from "express";
import Article from "../models/article";
import User from "../models/user";
import { ForbiddenError, NotFoundError } from "../utils/errors";
import { HttpStatus } from "../utils/HTTPStatusCodes";
import { StatusMessages } from "../utils/HTTPStatusMessages";

export const createArticle = async (req: Request, res: Response) => {
  const { title, body, category, image, readTime, tags, publishedAt } = req.body;
  const userId = (req as any).user.id;
  const article = await Article.create({
    title,
    body,
    category,
    image,
    readTime,
    tags,
    publishedAt,
    userId,
  });
  await User.findByIdAndUpdate(userId, { $inc: { totalArticles: 1 } });
  res.status(HttpStatus.CREATED).json({ article, message: StatusMessages.SUCCESS });
};

export const getArticles = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const user = await User.findById(userId).select("blockedArticles preferences");
  if (!user) throw new NotFoundError(StatusMessages.NOT_FOUND);
  const articles = await Article.find({ isBlocked: false, category: { $in: user.preferences } })
    .where("_id").nin(user.blockedArticles);
  res.json({ articles, message: StatusMessages.SUCCESS });
};

export const getUserArticles = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const articles = await Article.find({ userId }).select("-body");
  res.json({ articles, message: StatusMessages.SUCCESS });
};

export const getArticleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);
  res.json({ article, message: StatusMessages.SUCCESS });
};

export const updateArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, body, category, image, readTime, tags, publishedAt } = req.body;
  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);
  if (article.author !== (req as any).user.id) throw new ForbiddenError(StatusMessages.PERMISSION_DENIED);
  article.title = title || article.title;
  article.body = body || article.body;
  article.category = category || article.category;
  article.image = image || article.image;
  article.readTime = readTime || article.readTime;
  article.tags = tags || article.tags;
  article.publishedAt = publishedAt || article.publishedAt;
  await article.save();
  res.json({ article, message: StatusMessages.SUCCESS });
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);
  if (article.author !== (req as any).user.id) throw new ForbiddenError(StatusMessages.PERMISSION_DENIED);
  await Article.findByIdAndDelete(id);
  await User.findByIdAndUpdate(article.author, { $inc: { totalArticles: -1 } });
  res.json({ message: StatusMessages.SUCCESS });
};

export const likeArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);
  article.likes += 1;
  await article.save();
  await User.findByIdAndUpdate(article.author, { $inc: { totalLikes: 1, totalViews: 1 } });
  res.json({ article, message: StatusMessages.SUCCESS });
};

export const dislikeArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) throw new NotFoundError(StatusMessages.NOT_FOUND);
  article.dislikes += 1;
  await article.save();
  await User.findByIdAndUpdate(article.author, { $inc: { totalViews: 1 } });
  res.json({ article, message: StatusMessages.SUCCESS });
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