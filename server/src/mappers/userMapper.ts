import { IUser } from "../models/user";
import { UserDto } from "../dto/userDTO";

export const toUserDto = (user: IUser): UserDto => ({
  id: user._id!.toString(),
  email: user.email,
  phone: user.phone,
  firstName: user.firstName,
  lastName: user.lastName,
  dob: user.dob,
  preferences: user.preferences,
  totalArticles: user.totalArticles,
  totalViews: user.totalViews,
  totalLikes: user.totalLikes,
  isBlocked: user.isBlocked,
});