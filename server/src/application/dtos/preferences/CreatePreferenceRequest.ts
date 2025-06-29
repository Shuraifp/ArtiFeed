export class CreatePreferenceRequest {
  constructor(public readonly category: string) {}

  static fromHttp(req: any): CreatePreferenceRequest {
    return new CreatePreferenceRequest(req.body.category);
  }
}