export const REASON = {
    not_tokobapak_member: "Not a TokoBapak member",
    not_logged_in: "Not logged in",
    requires_higher_access: "Requires higher access",
} as const;
type Reason = typeof REASON[keyof typeof REASON];

export class UnauthorizedError extends Error {
    constructor(public readonly reason: Reason) {
        super(reason)
    }
}