import {GithubOrganization, GithubUser, IGithub} from "~/application/interfaces/IGithub";
import {GithubApiError} from "~/errors/GithubApiError";

export class GithubClient implements IGithub {
    constructor(
        private readonly clientId: string,
        private readonly clientSecret: string
    ) {}

    async accessToken(code: string): Promise<string> {
        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/vnd.github+json"
            },
            body: JSON.stringify({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code: code,
            })
        });

        const responseBody = await response.json();

        if (responseBody?.error !== undefined) {
            throw new GithubApiError(
                responseBody?.error_description ?? responseBody.error,
                responseBody?.error_uri ?? ""
            );
        }

        if (responseBody?.access_token !== undefined) {
            return responseBody.access_token;
        }

        throw new GithubApiError(
            "Unknown error, access_token and error field are undefined",
            "https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps"
        );
    }

    async getAuthenticatedUser(accessToken: string): Promise<GithubUser> {
        const response = await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": "Bearer " + accessToken
            }
        });

        const responseBody = await response.json();

        if (!response.ok) {
            throw new GithubApiError(
                responseBody.message,
                responseBody.documentation_url
            )
        }

        return responseBody as GithubUser;
    }

    async getUserOrganization(accessToken: string): Promise<GithubOrganization[]> {
        const response = await fetch("https://api.github.com/user/orgs", {
            method: "GET",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": "Bearer " + accessToken
            }
        });

        const responseBody = await response.json();

        if (!response.ok) {
            throw new GithubApiError(
                responseBody.message,
                responseBody.documentation_url
            )
        }

        return responseBody as GithubOrganization[];
    }


}