export class UserId {
  constructor(private readonly value: string) {
    if (!value) throw new Error("UserId cannot be empty");
  }

  toString(): string {
    return this.value;
  }
}