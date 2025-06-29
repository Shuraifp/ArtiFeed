export class GetUsersRequest {
  constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  static fromHttp(req: any): GetUsersRequest {
    return new GetUsersRequest(
      parseInt(req.query.page as string) || 1,
      parseInt(req.query.limit as string) || 10
    );
  }
}