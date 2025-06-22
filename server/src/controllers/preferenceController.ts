import { Request, Response } from "express";
import Preference from "../models/preference";
import { HttpStatus } from "../utils/HTTPStatusCodes";
import { StatusMessages } from "../utils/HTTPStatusMessages";
import { BadRequestError } from "../utils/errors";

export const getPreferences = async (req: Request, res: Response) => {
  const preferences = await Preference.find();
  res.status(HttpStatus.OK).json({ preferences: preferences.map(p => p.category), message: StatusMessages.SUCCESS });
};

export const addPreference = async (req: Request, res: Response) => {
  const { category } = req.body;
  const existing = await Preference.findOne({ category });
  if (existing) throw new BadRequestError(StatusMessages.BAD_REQUEST);
  await Preference.create({ category });
  res.json({ message: StatusMessages.SUCCESS });
};

export const deletePreference = async (req: Request, res: Response) => {
  const { category } = req.params;
  await Preference.deleteOne({ category });
  res.json({ message: StatusMessages.SUCCESS });
};