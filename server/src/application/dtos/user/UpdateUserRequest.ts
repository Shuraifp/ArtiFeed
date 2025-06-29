import { UserId } from "../../../domain/value-objects/UserId";

export class UpdateUserRequest {
  constructor(
    public readonly userId: UserId,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly password?: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly dob?: string,
    public readonly preferences?: string[]
  ) {}

  static fromHttp(req: any): UpdateUserRequest {
    return new UpdateUserRequest(
      new UserId(req.user.id),
      req.body.email,
      req.body.phone,
      req.body.password,
      req.body.firstName,
      req.body.lastName,
      req.body.dob,
      req.body.preferences
    );
  }
}
