import {Project} from "~/primitives/Project";
import {Token} from "~/primitives/Token";
import {UUID} from "~/primitives/UUID";

export interface IAuthentication {
    validateProjectToken(token: string): Promise<UUID>;
    createProjectToken(project: Project): Promise<Token>;
    validateUserToken(token: string): Promise<boolean>;
}