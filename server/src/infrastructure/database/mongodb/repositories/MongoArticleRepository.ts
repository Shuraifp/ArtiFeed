import { Article } from "../../../../domain/entities/Article";
import { ArticleId } from "../../../../domain/value-objects/ArticleId";
import { UserId } from "../../../../domain/value-objects/UserId";
import { ReadTime } from "../../../../domain/value-objects/ReadTime";
import {
  IArticleRepository,
  ArticleFilters,
} from "../../../../domain/repositories/IArticleRepository";
import ArticleModel, { IArticle } from "../models/ArticleModel";
import { Pagination } from "../../../../domain/repositories/IUserRepository";

export class MongoArticleRepository implements IArticleRepository {
  async create(article: Article): Promise<Article> {
    const articleDoc = new ArticleModel({
      title: article.getTitle(),
      body: article.getBody(),
      category: article.getCategory(),
      author: article.getAuthor().toString(),
      views: article.getViews(),
      likes: article.getLikes(),
      dislikes: article.getDislikes(),
      isBlocked: article.getIsBlocked(),
      publishedAt: article.getPublishedAt().toISOString(),
      readTime: article.getReadTime().value(),
      tags: article.getTags(),
      image: article.getImage(),
    });

    const savedDoc = await articleDoc.save();
    return this.toDomain(savedDoc);
  }

  async findById(
    id: ArticleId
  ): Promise<{ article: Article; authorName: string } | null> {
    const doc = await ArticleModel.findById(id.toString()).populate(
      "author",
      "firstName lastName"
    );
    if (!doc) return null;
    const author = doc.author as unknown as {
      _id: string;
      firstName: string;
      lastName: string;
    };
    const authorName = `${author.firstName} ${author.lastName}`;
    const article = this.toDomain(doc);
    return { article, authorName };
  }

  async findByAuthor(
    authorId: UserId,
    pagination: Pagination
  ): Promise<Article[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const docs = await ArticleModel.find({ author: authorId.toString() })
      .skip(skip)
      .limit(limit)
      .sort({ publishedAt: -1 });
    return docs.map(this.toDomain);
  }

  async findByFilters(
    filters: ArticleFilters,
    pagination: Pagination
  ): Promise<{ article: Article; authorName: string }[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const query: any = { isBlocked: filters.isBlocked };
    if (filters.category) query.category = { $in: filters.category };
    if (filters.blockedArticles)
      query._id = {
        $nin: filters.blockedArticles.map((id: ArticleId) => id.toString()),
      };
    const docs = await ArticleModel.find(query)
      .populate("author", "firstName lastName")
      .skip(skip)
      .limit(limit)
      .sort({ publishedAt: -1 });
    return docs.map((doc) => {
      const author = doc.author as unknown as {
        _id: string;
        firstName: string;
        lastName: string;
      };
      const authorName = `${author.firstName} ${author.lastName}`;
      const article = this.toDomain(doc);
      return { article, authorName };
    });
  }

  async findAllArticles(
    pagination: Pagination
  ): Promise<{ article: Article; authorName: string }[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const docs = await ArticleModel.find()
      .populate("author", "firstName lastName")
      .skip(skip)
      .limit(limit)
      .sort({ publishedAt: -1 });
    return docs.map((doc) => {
      const author = doc.author as unknown as {
        _id: string;
        firstName: string;
        lastName: string;
      };
      const authorName = `${author.firstName} ${author.lastName}`;
      const article = this.toDomain(doc);
      return { article, authorName };
    });
  }

  async update(article: Article): Promise<Article> {
    const updatedDoc = await ArticleModel.findByIdAndUpdate(
      article.getId().toString(),
      {
        title: article.getTitle(),
        body: article.getBody(),
        category: article.getCategory(),
        image: article.getImage(),
        readTime: article.getReadTime().value(),
        tags: article.getTags(),
        likes: article.getLikes(),
        dislikes: article.getDislikes(),
        isBlocked: article.getIsBlocked(),
      },
      { new: true }
    );
    if (!updatedDoc) throw new Error("Article not found");
    return this.toDomain(updatedDoc);
  }

  async delete(id: ArticleId): Promise<void> {
    await ArticleModel.findByIdAndDelete(id.toString());
  }

  async findAllArticlesForStats(): Promise<Article[]> {
    const docs = await ArticleModel.find().lean();
    return docs.map(this.toDomain);
  }

  async count(filters?: ArticleFilters): Promise<number> {
    const query: any = filters ? { isBlocked: filters.isBlocked } : {};
    if (filters?.category) query.category = { $in: filters.category };
    if (filters?.blockedArticles)
      query._id = {
        $nin: filters.blockedArticles.map((id: ArticleId) => id.toString()),
      };
    return ArticleModel.countDocuments(query);
  }

  async countAll(): Promise<number> {
    return ArticleModel.countDocuments();
  }

  async getTotalViews(): Promise<number> {
    const aggregation = await ArticleModel.aggregate([
      { $match: { isBlocked: false } },
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);
    return aggregation[0]?.total || 0;
  }

  async getAverageLikes(): Promise<number> {
    const aggregation = await ArticleModel.aggregate([
      { $match: { isBlocked: false } },
      { $group: { _id: null, avgLikes: { $avg: "$likes" } } },
    ]);
    return aggregation[0]?.avgLikes || 0;
  }

  async getAverageDislikes(): Promise<number> {
    const aggregation = await ArticleModel.aggregate([
      { $match: { isBlocked: false } },
      { $group: { _id: null, avgDislikes: { $avg: "$dislikes" } } },
    ]);
    return aggregation[0]?.avgDislikes || 0;
  }

  async getCategoryDistribution(): Promise<Record<string, number>> {
    const aggregation = await ArticleModel.aggregate([
      { $match: { isBlocked: false } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const distribution: Record<string, number> = {};
    aggregation.forEach((entry) => {
      distribution[entry._id] = entry.count;
    });
    return distribution;
  }

  private toDomain(doc: IArticle): Article {
    const authorId =
      typeof doc.author === "object" && "_id" in doc.author
        ? doc.author._id.toString()
        : doc.author;
    return new Article(
      new ArticleId(doc._id!.toString()),
      doc.title,
      doc.body,
      doc.category,
      new UserId(authorId),
      doc.views,
      doc.likes,
      doc.dislikes,
      doc.isBlocked,
      new Date(doc.publishedAt),
      new ReadTime(doc.readTime || 0),
      doc.tags || [],
      doc.image
    );
  }
}
