export class ArticleReactionId {
  constructor(private readonly value: string) {
    if (!value) throw new Error("ArticleReactionId cannot be empty");
  }

  toString(): string {
    return this.value;
  }
}