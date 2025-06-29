export interface StatsResponseDto {
  totalUsers: number;
  totalArticles: number;
  totalViews: number;
  averageLikes: number;
  averageDislikes: number;
  categoryDistribution: Record<string, number>;
}

export class StatsResponse {
  constructor(
    public readonly totalUsers: number,
    public readonly totalArticles: number,
    public readonly totalViews: number,
    public readonly averageLikes: number,
    public readonly averageDislikes: number,
    public readonly categoryDistribution: Record<string, number>
  ) {}

  static fromData(
    totalUsers: number,
    totalArticles: number,
    totalViews: number,
    averageLikes: number,
    averageDislikes: number,
    categoryDistribution: Record<string, number>
  ): StatsResponse {
    return new StatsResponse(
      totalUsers,
      totalArticles,
      totalViews,
      averageLikes,
      averageDislikes,
      categoryDistribution
    );
  }
}