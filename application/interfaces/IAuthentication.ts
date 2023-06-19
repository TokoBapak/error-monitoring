import {Project} from "~/primitives/Project";
import {Token} from "~/primitives/Token";
import {User} from "~~/primitives/User";

export interface IAuthentication {
    validateProjectToken(token: string): Promise<Project>;
    createProjectToken(project: Project): Promise<Token>;
    validateUserToken(token: string): Promise<User>;
    createUserToken(user: User): Promise<Token>;
}