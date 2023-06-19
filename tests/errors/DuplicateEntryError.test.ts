import { test, expect } from "vitest";
import {DuplicateEntryError} from "~/errors/DuplicateEntryError";

test("DuplicateEntryError", () => {
    const error = new DuplicateEntryError("foo", "bar");

    expect(error.field).toEqual("foo");
    expect(error.value).toEqual("bar");
    expect(error.name).toEqual("DuplicateEntryError");
    expect(error.message).toEqual("bar already existed for foo");
});