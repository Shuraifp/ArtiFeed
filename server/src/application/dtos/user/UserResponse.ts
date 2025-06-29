import { User } from "../../../domain/entities/User";

export interface UserDto {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dob: string;
  preferences: string[];
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  isBlocked: boolean;
}

export class UserResponse {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly dob: string,
    public readonly preferences: string[],
    public readonly totalArticles: number,
    public readonly totalViews: number,
    public readonly totalLikes: number,
    public readonly isBlocked: boolean
  ) {}

  static fromEntity(user: User): UserResponse {
    return new UserResponse(
      user.getId().toString(),
      user.getEmail(),
      user.getPhone(),
      user.getFirstName(),
      user.getLastName(),
      user.getDob(),
      user.getPreferences(),
      user.getTotalArticles(),
      user.getTotalViews(),
      user.getTotalLikes(),
      user.getIsBlocked()
    );
  }
}