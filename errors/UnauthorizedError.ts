type Reason =
    | "Not a TokoBapak member"
    | "Not logged in"
    | "Requires higher access";

export class UnauthorizedError extends Error {
    constructor(public readonly reason: Reason) {
        super(reason)
    }
}