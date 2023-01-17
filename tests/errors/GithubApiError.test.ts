import { test, expect } from "vitest";
import {GithubApiError} from "~/errors/GithubApiError";

test("GithubApiError", () => {
    const error = new GithubApiError("Not Found", "https://docs.github.com/rest");

    expect(error.description).toEqual("Not Found");
    expect(error.documentationUrl).toEqual("https://docs.github.com/rest");
    expect(error.message).toEqual("Not Found");
    expect(error.name).toEqual("GithubApiError");
})