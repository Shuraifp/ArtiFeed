import { Request, Response } from "express";
import Preference from "../models/preference";
import { HttpStatus } from "../utils/HTTPStatusCodes";
import { StatusMessages } from "../utils/HTTPStatusMessages";
import { BadRequestError } from "../utils/errors";
import User from "../models/user";

export const getPreferences = async (req: Request, res: Response) => {
  const preferences = await Preference.find({ isDeleted: false });
  res.status(HttpStatus.OK).json({
    preferences: preferences.map((p) => p.category),
    message: StatusMessages.SUCCESS,
  });
};

export const addPreference = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { category } = req.body;
  if (!category) {
    res.status(400).json({ message: "Category is required" });
    return;
  }
  const user = await User.findById(userId);
  if (user?.preferences.includes(category))
    throw new BadRequestError(StatusMessages.BAD_REQUEST);
  await User.updateOne({ _id: userId }, { $push: { preferences: category } });
  res.json({ message: StatusMessages.SUCCESS });
};

export const removePreference = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { category } = req.params;
  if (!category) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: "Category is required" });
    return;
  }
  const user = await User.findById(userId);
  if (!user?.preferences.includes(category))
    throw new BadRequestError(StatusMessages.BAD_REQUEST);
  await User.updateOne({ _id: userId }, { $pull: { preferences: category } });
  res.json({ message: StatusMessages.SUCCESS });
};

export const deletePreference = async (req: Request, res: Response) => {
  const { category } = req.params;
  await Preference.updateOne({ category }, { isDeleted: true });
  res.json({ message: StatusMessages.SUCCESS });
};

// restorePreferences...

export const createPreference = async (req: Request, res: Response) => {
  const { category } = req.body;

  if (!category) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: "Category is required" });
    return;
  }

  const exists = await Preference.findOne({ category });
  if (exists) {
    res.status(409).json({ message: "Category already exists" });
    return;
  }

  await Preference.create({ category });
  res.status(HttpStatus.CREATED).json({ message: StatusMessages.SUCCESS });
};
