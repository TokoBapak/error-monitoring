import {Project} from "~/primitives/Project";
import {Token} from "~/primitives/Token";

export interface IAuthentication {
    validateProjectToken(token: string): Promise<Project>;
    createProjectToken(project: Project): Promise<Token>;
    validateUserToken(token: string): Promise<boolean>;
}