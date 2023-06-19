import {type Token} from "~/primitives/Token";
import {User} from "~/primitives/User";

export interface ITokenRepository {
    /**
     * Generate a token for authentication
     * @param user User from GitHub
     */
    generate(user: User): Token

    /**
     * Acquire a User class from the specified token.
     * If the token is invalid or revoked, it will throws UnauthenticatedError.
     * @param token
     * @throws {UnauthenticatedError} If the token is invalid or revoked
     */
    acquire(token: string): User

    /**
     * Mark the token as revoked.
     * If the token does not exists on store, it will do nothing.
     * If the token is already revoked, it's safe to call this multiple times.
     * @param token
     */
    revoke(token: string): void
}