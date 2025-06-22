import { Request, Response } from "express";
import Article from "../models/article";
import User from "../models/user";
import { HttpStatus } from "../utils/HTTPStatusCodes";
import { StatusMessages } from "../utils/HTTPStatusMessages";

export const getStats = async (req: Request, res: Response) => {
  const articles = await Article.find();
  const totalUsers = await User.countDocuments();

  const totalArticles = articles.length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const averageLikes = totalArticles ? articles.reduce((sum, a) => sum + a.likes, 0) / totalArticles : 0;
  const averageDislikes = totalArticles ? articles.reduce((sum, a) => sum + a.dislikes, 0) / totalArticles : 0;

  const categoryDistribution = articles.reduce((dist: Record<string, number>, article) => {
    dist[article.category] = (dist[article.category] || 0) + 1;
    return dist;
  }, {});

  const stats = {
    totalUsers,
    totalArticles,
    totalViews,
    averageLikes,
    averageDislikes,
    categoryDistribution,
  };

  res.status(HttpStatus.OK).json({
    message: StatusMessages.SUCCESS,
    stats,
  });
};
