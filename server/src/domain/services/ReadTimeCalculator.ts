import { ReadTime } from "../value-objects/ReadTime";

export class ReadTimeCalculator {
  private readonly wordsPerMinute = 200;

  calculate(body: string): ReadTime {
    const wordCount = body.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / this.wordsPerMinute);
    return new ReadTime(minutes);
  }
}