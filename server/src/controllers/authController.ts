import { Request, Response } from "express";
import { generateToken, verifyToken } from "../config/jwt";
import User from "../models/user";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "../utils/errors";
import { toUserDto } from "../mappers/userMapper";
import { UserDto } from "../dto/userDTO";
import { HttpStatus } from "../utils/HTTPStatusCodes";
import { ACCESS_EXPIRY, REFRESH_EXPIRY } from "../types/jwt";
import { StatusMessages } from "../utils/HTTPStatusMessages";
import { JWTPayload } from "../middlewares/authMiddleware";
import { Roles } from "../types/type";

export const signup = async (req: Request, res: Response) => {
  const { email, password, phone, firstName, lastName, dob, preferences } =
    req.body;
  if (!firstName || !lastName || !dob || !email || !password) {
    res.status(HttpStatus.BAD_REQUEST).json(StatusMessages.INVALID_INPUT);
    return;
  }

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: "User already exists" });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email,
    phone: phone,
    password: hashedPassword,
    firstName,
    lastName,
    dob,
    preferences,
    role: Roles.User,
  });
  const token = generateToken(
    { id: user._id!.toString(), email, role: Roles.User },
    ACCESS_EXPIRY
  );
  const refreshToken = generateToken(
    { id: user._id!.toString(), email, role: Roles.User },
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
    .json({ user: user._id, message: StatusMessages.SUCCESS });
};

export const login = async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;
  let query: { email?: string; phone?: string; role: string } = {
    role: Roles.User,
  };
  if (email) {
    query.email = email;
  } else if (phone) {
    query.phone = phone;
  }
  if (!query.email && !query.phone) {
    res.status(HttpStatus.BAD_REQUEST).json(StatusMessages.INVALID_INPUT);
    return;
  }
  const user = await User.findOne(query);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError(StatusMessages.UNAUTHORIZED);
  }
  const token = generateToken(
    { id: user._id!.toString(), email: user.email, role: Roles.User },
    ACCESS_EXPIRY
  );
  const refreshToken = generateToken(
    { id: user._id!.toString(), email: user.email, role: Roles.User },
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
  res.json({ user: user._id, message: StatusMessages.SUCCESS });
};

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: Roles.Admin });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError(StatusMessages.UNAUTHORIZED);
  }
  const token = generateToken(
    {
      id: user._id!.toString(),
      email: user.email,
      role: Roles.Admin,
    },
    ACCESS_EXPIRY
  );
  const refreshToken = generateToken(
    { id: user._id!.toString(), email: user.email, role: Roles.Admin },
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
  res.json({ user: user._id, message: StatusMessages.SUCCESS });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("userAccessToken", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.clearCookie("userRefreshToken", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(HttpStatus.OK).json({ message: StatusMessages.SUCCESS });
};

export const logoutAdmin = async (req: Request, res: Response) => {
  res.clearCookie("adminAccessToken", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.clearCookie("adminRefreshToken", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(HttpStatus.OK).json({ message: StatusMessages.SUCCESS });
};

export const refreshToken = async (
  req: Request,
  res: Response,
  role: string
) => {
  console.log(process.env.NODE_ENV);
  const refreshToken = req.cookies.userRefreshToken;
  if (!refreshToken) {
    throw new UnauthorizedError(StatusMessages.UNAUTHORIZED);
  }
  try {
    const decoded = verifyToken(refreshToken) as JWTPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError(StatusMessages.UNAUTHORIZED);
    }
    const token = generateToken(
      { id: user._id!.toString(), email: user.email, role },
      ACCESS_EXPIRY
    );
    res.cookie(
      role === Roles.User ? "userAccessToken" : "adminAccessToken",
      token,
      {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: ACCESS_EXPIRY * 1000,
      }
    );
    res.json({ user: toUserDto(user), message: StatusMessages.SUCCESS });
  } catch (error) {
    throw new UnauthorizedError(StatusMessages.UNAUTHORIZED);
  }
};
