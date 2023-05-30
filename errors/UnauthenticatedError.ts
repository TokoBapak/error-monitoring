export class UnauthenticatedError extends Error {
    constructor(message = "Unauthenticated") {
        super(message ?? "Unauthenticated");
    }
}