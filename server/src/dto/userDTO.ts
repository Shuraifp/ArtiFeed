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