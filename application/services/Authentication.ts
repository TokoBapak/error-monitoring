import {IAuthentication} from "~/application/interfaces/IAuthentication";
import {Project} from "~/primitives/Project";
import {Token} from "~/primitives/Token";
import {UUID} from "~/primitives/UUID";
import {ICache} from "~/application/interfaces/ICache";
import {UnauthenticatedError} from "~/errors/UnauthenticatedError";

export class Authentication implements IAuthentication {
    constructor(
        private readonly memoryCache: ICache,
    ) { }

    createProjectToken(project: Project): Promise<Token> {
        const uuid = new UUID();

        if (this.memoryCache.has(uuid.toString())) {
            // Recurse if found
            return this.createProjectToken(project);
        }

        this.memoryCache.set(uuid.toString(), project.toString());

        return Promise.resolve({
            accessToken: uuid.toString(),
            expiredAt: new Date(0)
        });
    }

    validateProjectToken(token: string): Promise<Project> {
        if (!this.memoryCache.has(token)) throw new UnauthenticatedError();

        const rawPayload = this.memoryCache.get<string>(token);

        if (rawPayload === undefined) throw new UnauthenticatedError();

        const payload = Project.fromJSONString(rawPayload);

        return Promise.resolve(payload);
    }

    validateUserToken(token: string): Promise<boolean> {
        return Promise.resolve(false);
    }

}