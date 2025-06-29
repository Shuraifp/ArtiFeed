import { UserId } from "../../../domain/value-objects/UserId";

export class RemovePreferenceRequest {
  constructor(
    public readonly userId: UserId,
    public readonly category: string
  ) {}

  static fromHttp(req: any): RemovePreferenceRequest {
    return new RemovePreferenceRequest(
      new UserId(req.user.id),
      req.params.category
    );
  }
}