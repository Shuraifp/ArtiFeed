export class GetAllArticlesRequest {
  constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  static fromHttp(req: any): GetAllArticlesRequest {
    return new GetAllArticlesRequest(
      parseInt(req.query.page as string) || 1,
      parseInt(req.query.limit as string) || 6
    );
  }
}