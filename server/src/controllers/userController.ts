import { Request, Response } from "express";
import User from "../models/user";
import { toUserDto } from "../mappers/userMapper";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { HttpStatus } from "../utils/HTTPStatusCodes";
import { StatusMessages } from "../utils/HTTPStatusMessages";
import bcrypt from "bcrypt";

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
  const users = await User.find().select("-password");
  res.json({ users: users.map(toUserDto), message: StatusMessages.SUCCESS });
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

export const blockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new NotFoundError(StatusMessages.NOT_FOUND);
  user.isBlocked = true;
  await user.save();
  res.json({ user: toUserDto(user), message: "User blocked" });
};
