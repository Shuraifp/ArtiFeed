export interface AuthUser {
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
}

export interface UserProfile {
  id:string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  preferences: string[];
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  isBlocked:boolean;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
  confirmPassword: string;
  preferences: string[];
}
