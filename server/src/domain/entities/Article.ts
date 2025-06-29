import { ArticleId } from "../value-objects/ArticleId";
import { UserId } from "../value-objects/UserId";
import { ReadTime } from "../value-objects/ReadTime";
import { BadRequestError, NotFoundError } from "../../shared/errors";

export class Article {
  constructor(
    private id: ArticleId | null,
    private title: string,
    private body: string,
    private category: string,
    private readonly author: UserId,
    private views: number = 0,
    private likes: number = 0,
    private dislikes: number = 0,
    private isBlocked: boolean = false,
    private readonly publishedAt: Date = new Date(),
    private readonly readTime: ReadTime,
    private tags: string[] = [],
    private image?: string
  ) {}

  like(): void {
    if (this.isBlocked) {
      throw new Error("Cannot like blocked article");
    }
    this.likes++;
  }
  
  undoLike(): void {
    if (this.isBlocked) {
      throw new Error("Cannot like blocked article");
    }
    this.likes--;
  }

  dislike(): void {
    if (this.isBlocked) {
      throw new Error("Cannot dislike blocked article");
    }
    this.dislikes++;
  }
  
  undoDislike(): void {
    if (this.isBlocked) {
      throw new Error("Cannot dislike blocked article");
    }
    this.dislikes--;
  }

  block(): void {
    this.isBlocked = true;
  }

  incrementViews(): void {
    this.views++;
  }

  update(
    title?: string,
    body?: string,
    category?: string,
    image?: string,
    tags?: string[]
  ): void {
    this.title = title || this.title;
    this.body = body || this.body;
    this.category = category || this.category;
    this.image = image || this.image;
    this.tags = tags || this.tags;
  }

  setId(id: ArticleId): void {
    if (this.id !== null) throw new Error("Article ID has already been set");
    this.id = id;
  }
  getId(): ArticleId {
    if (!this.id)
      throw new NotFoundError("Article ID has not been assigned yet.");
    return this.id;
  }
  getTitle(): string {
    return this.title;
  }
  getBody(): string {
    return this.body;
  }
  getCategory(): string {
    return this.category;
  }
  getAuthor(): UserId {
    // if (!(this.author instanceof UserId)) {
    //   throw new BadRequestError(
    //     "Author field is populated object, not UserId."
    //   );
    // }
    return this.author;
  }
  getViews(): number {
    return this.views;
  }
  getLikes(): number {
    return this.likes;
  }
  getDislikes(): number {
    return this.dislikes;
  }
  getIsBlocked(): boolean {
    return this.isBlocked;
  }
  getPublishedAt(): Date {
    return this.publishedAt;
  }
  getReadTime(): ReadTime {
    return this.readTime;
  }
  getTags(): string[] {
    return [...this.tags];
  }
  getImage(): string | undefined {
    return this.image;
  }
}
