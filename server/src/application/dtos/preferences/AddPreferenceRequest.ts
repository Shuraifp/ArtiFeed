import { UserId } from "../../../domain/value-objects/UserId";

export class AddPreferenceRequest {
  constructor(
    public readonly userId: UserId,
    public readonly category: string
  ) {}

  static fromHttp(req: any): AddPreferenceRequest {
    return new AddPreferenceRequest(
      new UserId(req.user.id),
      req.body.category
    );
  }
}