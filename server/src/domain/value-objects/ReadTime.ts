export class ReadTime {
  constructor(private readonly minutes: number) {
    if (minutes < 0) throw new Error("ReadTime cannot be negative");
  }

  value(): number {
    return this.minutes;
  }
}
