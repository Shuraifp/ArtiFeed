import { User } from "../../../../domain/entities/User";
import { UserId } from "../../../../domain/value-objects/UserId";
import {
  IUserRepository,
  UserPreferences,
  Pagination,
} from "../../../../domain/repositories/IUserRepository";
import { Roles } from "../../../../shared/constants/Roles";
import UserModel, { IUser } from "../models/UserModel";
import { NotFoundError } from "../../../../shared/errors";
import { ArticleId } from "../../../../domain/value-objects/ArticleId";

export class MongoUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const userDoc = new UserModel({
      email: user.getEmail(),
      phone: user.getPhone(),
      password: user.getPassword(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      dob: user.getDob(),
      preferences: user.getPreferences(),
      totalArticles: user.getTotalArticles(),
      totalViews: user.getTotalViews(),
      totalLikes: user.getTotalLikes(),
      isBlocked: user.getIsBlocked(),
      role: user.getRole(),
      blockedArticles: user.getBlockedArticles(),
    });

    const savedDoc = await userDoc.save();
    return this.toDomain(savedDoc);
  }

  async findById(id: UserId): Promise<User | null> {
    const doc = await UserModel.findById(id.toString());
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async findByPhone(phone: string): Promise<User | null> {
    const doc = await UserModel.findOne({ phone });
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async findAll(pagination: Pagination, role: Roles): Promise<User[]> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const docs = await UserModel.find({ role })
      .select("-password")
      .skip(skip)
      .limit(limit);
    return docs.map(this.toDomain);
  }

  async update(user: User): Promise<User> {
    const updatedDoc = await UserModel.findByIdAndUpdate(
      user.getId().toString(),
      {
        email: user.getEmail(),
        phone: user.getPhone(),
        password: user.getPassword(),
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        dob: user.getDob(),
        preferences: user.getPreferences(),
        totalArticles: user.getTotalArticles(),
        totalViews: user.getTotalViews(),
        totalLikes: user.getTotalLikes(),
        isBlocked: user.getIsBlocked(),
        blockedArticles: user.getBlockedArticles(),
      },
      { new: true }
    );
    if (!updatedDoc) throw new NotFoundError("User not found");
    return this.toDomain(updatedDoc);
  }

  async delete(id: UserId): Promise<void> {
    await UserModel.findByIdAndDelete(id.toString());
  }

  async count(role: Roles): Promise<number> {
    return UserModel.countDocuments({ role, isBlocked: false });
  }

  async getUserPreferences(userId: UserId): Promise<UserPreferences> {
    const user = await UserModel.findById(userId.toString()).select(
      "preferences blockedArticles"
    );
    if (!user) throw new Error("User not found");
    return {
      preferences: user.preferences,
      blockedArticles: user.blockedArticles,
    };
  }

  async incrementArticleCount(userId: UserId): Promise<void> {
    await UserModel.findByIdAndUpdate(userId.toString(), {
      $inc: { totalArticles: 1 },
    });
  }

  async decrementArticleCount(userId: UserId): Promise<void> {
    await UserModel.findByIdAndUpdate(userId.toString(), {
      $inc: { totalArticles: -1 },
    });
  }

  async incrementLikes(userId: UserId): Promise<void> {
    await UserModel.findByIdAndUpdate(userId.toString(), {
      $inc: { totalLikes: 1 },
    });
  }

  async decrementLikes(userId: UserId): Promise<void> {
    await UserModel.findByIdAndUpdate(userId.toString(), {
      $inc: { totalLikes: -1 },
    });
  }

  async incrementViews(userId: UserId): Promise<void> {
    await UserModel.findByIdAndUpdate(userId.toString(), {
      $inc: { totalViews: 1 },
    });
  }

  async blockArticle(userId: UserId, articleId: ArticleId): Promise<void> {
    await UserModel.findByIdAndUpdate(userId.toString(), {
      $addToSet: { blockedArticles: articleId },
    });
  }

  async addPreference(userId: UserId, category: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId.toString(), { $addToSet: { preferences: category } });
  }

  async removePreference(userId: UserId, category: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId.toString(), { $pull: { preferences: category } });
  }

  private toDomain(doc: IUser): User {
    return new User(
      new UserId(doc._id!.toString()),
      doc.email,
      doc.phone,
      doc.password,
      doc.firstName,
      doc.lastName,
      doc.dob,
      doc.preferences,
      doc.totalArticles,
      doc.totalViews,
      doc.totalLikes,
      doc.isBlocked,
      doc.role,
      doc.blockedArticles
    );
  }
}
