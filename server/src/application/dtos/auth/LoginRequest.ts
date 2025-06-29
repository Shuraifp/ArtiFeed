export class LoginRequest {
  constructor(
    public readonly password: string,
    public readonly email?: string,
    public readonly phone?: string,
  ) {}

  static fromHttp(req: any): LoginRequest {
    return new LoginRequest(
      req.body.password,
      req.body.email,
      req.body.phone,
    );
  }
}