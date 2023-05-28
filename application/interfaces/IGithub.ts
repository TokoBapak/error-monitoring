export type GithubUser = {
    login: string,
    id: number,
    node_id: string,
    avatar_url: string,
    gravatar_id: string,
    url: string,
    html_url: string,
    name: string,
}

export type GithubOrganization = {
    login: string,
    id: number,
    node_id: string,
}

export interface IGithub {
    /**
     * Acquire access token from GitHub authentication web flow.
     *
     * @param code Code acquired from the PKCE exchange.
     * @throws {GithubApiError} Something wrong with the request/response
     * @see https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
     */
    accessToken(code: string): Promise<string>;

    /**
     * Acquire GitHub user profile based on the specified access token
     * (which should be acquired from the accessToken() function.
     *
     * @param accessToken Github access token from PKCE exchange result
     * @throws {GithubApiError} Something wrong with the request/response
     * @see https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
     */
    getAuthenticatedUser(accessToken: string): Promise<GithubUser>

    /**
     * Acquire GitHub user's list of organization, solely from the access token.
     *
     * @param accessToken Github access token from PKCE exchange result
     * @throws {GithubApiError} Something wrong with the request/response
     * @see https://docs.github.com/en/rest/orgs/orgs?apiVersion=2022-11-28#list-organizations
     */
    getUserOrganization(accessToken: string): Promise<GithubOrganization[]>
}