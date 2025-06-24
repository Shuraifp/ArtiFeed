import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { toUserDto } from "../mappers/userMapper";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { HttpStatus } from "../utils/HTTPStatusCodes";
import { StatusMessages } from "../utils/HTTPStatusMessages";
import bcrypt from "bcrypt";
import ArticleReaction, { ReactionStatus } from "../models/articleReaction";
import Article from "../models/article";
import { Roles } from "../types/type";

export const createUser = async (req: Request, res: Response) => {
  const { email, password, phone, firstName, lastName, dob, preferences } =
    req.body;
  if (!firstName || !lastName || !dob || !email || !password) {
    res.status(HttpStatus.BAD_REQUEST).json(StatusMessages.INVALID_INPUT);
    return;
  }
  const user = await User.create({
    email,
    phone: phone || "",
    password,
    firstName,
    lastName,
    dob,
    preferences,
    role: "user",
  });
  res.status(HttpStatus.CREATED).json({
    user: toUserDto(user),
    message: StatusMessages.SUCCESS,
  });
};

export const getUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const totalUsers = await User.countDocuments({ role: Roles.User });
  const users = await User.find({ role: Roles.User })
    .select("-password")
    .skip(skip)
    .limit(limit);

  res.json({
    users: users.map(toUserDto),
    total: totalUsers,
    page,
    totalPages: Math.ceil(totalUsers / limit),
    message: StatusMessages.SUCCESS,
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.user?.id;
  const user = await User.findById(id).select("-password");
  if (!user) throw new NotFoundError(StatusMessages.NOT_FOUND);
  res.json({ user: toUserDto(user), message: StatusMessages.SUCCESS });
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { firstName, lastName, dob, preferences, email, phone, password } =
    req.body;
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError(StatusMessages.NOT_FOUND);
  const existingUser = await User.findOne({
    _id: { $ne: userId },
    $or: [{ email }, { phone }],
  });
  if (existingUser) {
    throw new BadRequestError("Email or phone already in use by another user");
  }
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (dob) user.dob = dob;
  if (preferences) user.preferences = preferences;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (password) user.password = await bcrypt.hash(password, 10);
  await user.save();
  res.json({ user: toUserDto(user), message: StatusMessages.SUCCESS });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new NotFoundError(StatusMessages.NOT_FOUND);
  res.json({ message: StatusMessages.SUCCESS });
};

export const toggleBlockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new NotFoundError(StatusMessages.NOT_FOUND);
  if (user.isBlocked) {
    user.isBlocked = false;
  } else {
    user.isBlocked = true;
  }
  await user.save();
  res.json({ user: toUserDto(user), message: "User blocked" });
};

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activeUsers = await User.countDocuments({ isBlocked: false });

    const totalArticles = await Article.countDocuments({ isBlocked: false });

    const totalReactions = await ArticleReaction.countDocuments();
    const likedReactions = await ArticleReaction.countDocuments({
      status: ReactionStatus.Like,
    });
    const satisfactionRate =
      totalReactions > 0
        ? Math.round((likedReactions / totalReactions) * 100)
        : 0;

    res.status(HttpStatus.OK).json({
      stats: {
        activeUsers,
        totalArticles,
        satisfactionRate: `${satisfactionRate}%`,
      },
      message: StatusMessages.SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};


export const getAdminStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalUsers = await User.countDocuments({ role: Roles.User });
    const totalArticles = await Article.countDocuments();
    const totalViewsAggregation = await Article.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);
    const totalViews = totalViewsAggregation[0]?.total || 0;
    const reactionsAggregation = await ArticleReaction.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    let averageLikes = 0;
    let averageDislikes = 0;

    reactionsAggregation.forEach((item) => {
      if (item._id === "like") averageLikes = item.count;
      if (item._id === "dislike") averageDislikes = item.count;
    });
    
    const categoryAggregation = await Article.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const categoryDistribution: Record<string, number> = {};
    categoryAggregation.forEach((entry) => {
      categoryDistribution[entry._id] = entry.count;
    });

    res.status(HttpStatus.OK).json({
      stats: {
        totalUsers,
        totalArticles,
        totalViews,
        averageLikes,
        averageDislikes,
        categoryDistribution,
      },
      message: StatusMessages.SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};