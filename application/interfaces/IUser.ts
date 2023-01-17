import {Token} from "~/primitives/Token";

export interface IUser {
    /**
     * Exchange the specified GitHub code with an access token, then calls the
     * user and organization API.
     *
     * If the user does not belong in the TokoBapak organization, it will throw an
     * UnauthorizedError.
     *
     * If the user exists on the database yet the organization API response said they're not
     * a part of it, we should delete the user.
     *
     * If user exists on the database, it will generate an access token for error-monitoring API.
     *
     * If the user does not exist on the database, it will create a new one.
     *
     * @param githubCode Code acquired from the GitHub OAuth2 callback URL parameters.
     * @throws {UnauthorizedError} If the user does not belong in the TokoBapak organization.
     */
    login(githubCode: string): Promise<Token>;

    /**
     * Invalidates the provided access token. You can't do stuff with that access token anymore.
     *
     * @param accessToken
     */
    logout(accessToken: string): Promise<void>;
}