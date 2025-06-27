import { authResponseDto } from "../dto/authResponseDTO";
import { IUser } from "../models/user";

export const toAuthResponseDto = (user: IUser): authResponseDto => ({
  id: user._id!.toString(),
  name: user.firstName + " " + user.lastName,
});
