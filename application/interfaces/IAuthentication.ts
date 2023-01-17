import {Project} from "~/primitives/Project";
import {Token} from "~/primitives/Token";
import {GithubUser} from "~/application/interfaces/IGithub";

export interface IAuthentication {
    validateProjectToken(token: string): Promise<Project>;
    createProjectToken(project: Project): Promise<Token>;
    validateUserToken(token: string): Promise<GithubUser>;
    createUserToken(user: GithubUser): Promise<Token>;
}