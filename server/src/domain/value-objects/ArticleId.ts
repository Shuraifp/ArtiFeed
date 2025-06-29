export class ArticleId {
  constructor(private readonly value: string) {
    if (!value) throw new Error("ArticleId cannot be empty");
  }

  toString(): string {
    return this.value;
  }
}