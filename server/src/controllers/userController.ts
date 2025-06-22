import { Request, Response } from "express";
import User from "../models/user";
import { toUserDto } from "../mappers/userMapper";
import { NotFoundError } from "../utils/errors";
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
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) throw new NotFoundError(StatusMessages.NOT_FOUND);
  res.json({ user: toUserDto(user), message: StatusMessages.SUCCESS });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, dob, preferences, password } = req.body;
  const user = await User.findById(id);
  if (!user) throw new NotFoundError(StatusMessages.NOT_FOUND);
  if (password) user.password = await bcrypt.hash(password, 10);
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.dob = dob || user.dob;
  user.preferences = preferences || user.preferences;
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