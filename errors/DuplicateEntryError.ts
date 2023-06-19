export class DuplicateEntryError extends Error {
    constructor(public readonly field: string, public readonly value: string) {
        super(`${value} already existed for ${field}`);
        this.name = "DuplicateEntryError";
  }
}