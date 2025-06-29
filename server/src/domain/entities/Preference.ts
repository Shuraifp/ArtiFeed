import { NotFoundError } from "../../shared/errors";
import { PreferenceId } from "../value-objects/PreferenceId";

export class Preference {
  constructor(
    private id: PreferenceId | null,
    private readonly category: string,
    private isDeleted: boolean = false
  ) {}

  delete(): void {
    this.isDeleted = true;
  }

  restore(): void {
    this.isDeleted = false;
  }

  getCategory(): string {
    return this.category;
  }

  getIsDeleted(): boolean {
    return this.isDeleted;
  }

  getId(): PreferenceId {
    if (!this.id)
          throw new NotFoundError("Preference ID has not been assigned yet.");
    return this.id;
  }
}
