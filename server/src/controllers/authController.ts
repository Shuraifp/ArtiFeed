import { Request, Response } from "express";
import { generateToken } from "../config/jwt";
import User from "../models/user";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "../utils/errors";
import { toUserDto } from "../mappers/userMapper";
import { UserDto } from "../dto/userDTO";
import { HttpStatus } from "../utils/HTTPStatusCodes";
import { ACCESS_EXPIRY, REFRESH_EXPIRY } from "../types/jwt";
import { StatusMessages } from "../utils/HTTPStatusMessages";

export const signup = async (req: Request, res: Response) => {
  const { email, password, phone, firstName, lastName, dob, preferences } =
    req.body;
  if (!firstName || !lastName || !dob || !email || !password) {
    res.status(HttpStatus.BAD_REQUEST).json(StatusMessages.INVALID_INPUT);
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email,
    phone: phone || "",
    password: hashedPassword,
    firstName,
    lastName,
    dob,
    preferences,
    role: "user",
  });
  const token = generateToken(
    { id: user._id!.toString(), email, role: "user" },
    ACCESS_EXPIRY
  );
  const refreshToken = generateToken(
    { id: user._id!.toString(), email, role: "user" },
    REFRESH_EXPIRY
  );
  res.cookie("userAccessToken", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ACCESS_EXPIRY * 1000,
  });
  res.cookie("userRefreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: REFRESH_EXPIRY * 1000,
  });
  res
    .status(HttpStatus.CREATED)
    .json({ user: toUserDto(user), message: StatusMessages.SUCCESS });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: "user" });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError(StatusMessages.UNAUTHORIZED);
  }
  const token = generateToken(
    { id: user._id!.toString(), email: user.email, role: "user" },
    ACCESS_EXPIRY
  );
  const refreshToken = generateToken(
    { id: user._id!.toString(), email: user.email, role: "user" },
    REFRESH_EXPIRY
  );
  res.cookie("userAccessToken", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ACCESS_EXPIRY * 1000,
  });
  res.cookie("userRefreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: REFRESH_EXPIRY * 1000,
  });
  res.json({ user: toUserDto(user), message: StatusMessages.SUCCESS });
};

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: "admin" });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError(StatusMessages.UNAUTHORIZED);
  }
  const token = generateToken(
    {
      id: user._id!.toString(),
      email: user.email,
      role: "admin",
    },
    ACCESS_EXPIRY
  );
  const refreshToken = generateToken(
    { id: user._id!.toString(), email: user.email, role: "admin" },
    REFRESH_EXPIRY
  );
  res.cookie("adminAccessToken", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ACCESS_EXPIRY * 1000,
  });
  res.cookie("adminRefreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: REFRESH_EXPIRY * 1000,
  });
  res.json({ user: toUserDto(user), message: StatusMessages.SUCCESS });
};
