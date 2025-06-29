export class GetArticlesRequest {
  constructor(
    public readonly userId: string,
    public readonly page: number,
    public readonly limit: number
  ) {}

  static fromHttp(req: any): GetArticlesRequest {
    return new GetArticlesRequest(
      req.user.id,
      parseInt(req.query.page as string) || 1,
      parseInt(req.query.limit as string) || 6
    );
  }
}