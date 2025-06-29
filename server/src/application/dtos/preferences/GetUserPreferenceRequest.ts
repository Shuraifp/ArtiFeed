import { UserId } from "../../../domain/value-objects/UserId";

export class GetUserPreferenceRequest {
  constructor(public readonly userId: UserId) {}

  static fromHttp(req: any): GetUserPreferenceRequest {
    return new GetUserPreferenceRequest(new UserId(req.user.id));
  }
}
