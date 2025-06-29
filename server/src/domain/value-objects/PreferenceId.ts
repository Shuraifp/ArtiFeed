export class PreferenceId {
  constructor(private readonly value: string) {
    if (!value) throw new Error("PreferenceId cannot be empty");
  }

  toString(): string {
    return this.value;
  }
}