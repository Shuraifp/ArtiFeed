export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AdminStats {
  totalUsers: number;
  totalArticles: number;
  totalViews: number;
  averageLikes: number;
  averageDislikes: number;
  categoryDistribution: { [key: string]: number };
}

export type AdminPageKey = "dashboard" | "users" | "articles" | "preferences" | "stats";