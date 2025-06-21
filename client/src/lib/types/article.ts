export interface Article {
  id: string;
  title: string;
  body: string; 
  category: string;
  image?: string;
  views: number;
  readTime?: number;
  tags?: string[];
  publishedAt: string;
  likes: number;
  dislikes: number;
}

export type PageKey = "dashboard" | "create" | "articles" | "settings" | "profile";

export interface ArticleFormData {
  title: string;
  body: string;
  category: string;
  tags: string[];
  image: File | null;
}

export const categories = [
  "Sports",
  "Politics",
  "Space",
  "Technology",
  "Health",
  "Business",
  "Entertainment",
  "Science",
];
export const tagsOptions = [
  "Breaking News",
  "In-Depth",
  "Analysis",
  "Opinion",
  "Tutorial",
];
