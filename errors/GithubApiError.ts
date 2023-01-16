export class GithubApiError extends Error {
    constructor(public readonly description: string, public readonly documentationUrl: string) {
        super(description);
    }
}