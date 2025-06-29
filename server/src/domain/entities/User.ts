import { UserId } from "../value-objects/UserId";
import { Roles } from "../../shared/constants/Roles";

export class User {
  constructor(
    private id: UserId | null,
    private email: string,
    private phone: string,
    private password: string,
    private firstName: string,
    private lastName: string,
    private dob: string,
    private preferences: string[] = [],
    private totalArticles: number = 0,
    private totalViews: number = 0,
    private totalLikes: number = 0,
    private isBlocked: boolean = false,
    private readonly role: Roles = Roles.User,
    private blockedArticles: string[] = []
  ) {}

  update({
    email,
    phone,
    firstName,
    lastName,
    dob,
    preferences,
    password,
  }: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    dob?: string;
    preferences?: string[];
    password?: string;
  }): void {
    if (email) this.email = email;
    if (phone) this.phone = phone;
    if (firstName) this.firstName = firstName;
    if (lastName) this.lastName = lastName;
    if (dob) this.dob = dob;
    if (preferences) this.preferences = preferences;
    if (password) this.password = password;
  }

  toggleBlock(): void {
    this.isBlocked = !this.isBlocked;
  }

  incrementArticles(): void {
    this.totalArticles++;
  }

  decrementArticles(): void {
    this.totalArticles--;
  }

  incrementLikes(): void {
    this.totalLikes++;
  }

  decrementLikes(): void {
    this.totalLikes--;
  }

  incrementViews(): void {
    this.totalViews++;
  }

  blockArticle(articleId: string): void {
    if (!this.blockedArticles.includes(articleId)) {
      this.blockedArticles.push(articleId);
    }
  }

  setId(id: UserId): void {
    if (this.id !== null) throw new Error("User ID has already been set");
    this.id = id;
  }

  getId(): UserId {
    if (!this.id) throw new Error("User ID has not been assigned yet.");
    return this.id;
  }
  getEmail(): string {
    return this.email;
  }
  getPhone(): string {
    return this.phone;
  }
  getPassword(): string {
    return this.password;
  }
  getFirstName(): string {
    return this.firstName;
  }
  getLastName(): string {
    return this.lastName;
  }
  getDob(): string {
    return this.dob;
  }
  getPreferences(): string[] {
    return [...this.preferences];
  }
  getTotalArticles(): number {
    return this.totalArticles;
  }
  getTotalViews(): number {
    return this.totalViews;
  }
  getTotalLikes(): number {
    return this.totalLikes;
  }
  getIsBlocked(): boolean {
    return this.isBlocked;
  }
  getRole(): Roles {
    return this.role;
  }
  getBlockedArticles(): string[] {
    return [...this.blockedArticles];
  }
}
