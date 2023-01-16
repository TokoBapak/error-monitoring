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
    accessToken(code: string): Promise<string>;
    getAuthenticatedUser(accessToken: string): Promise<GithubUser>
    getUserOrganization(accessToken: string): Promise<GithubOrganization[]>
}