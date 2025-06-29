export class DeletePreferenceRequest {
  constructor(public readonly category: string) {}

  static fromHttp(req: any): DeletePreferenceRequest {
    return new DeletePreferenceRequest(req.params.category);
  }
}