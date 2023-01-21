import {IAuthentication} from "~/application/interfaces/IAuthentication";
import {Project} from "~/primitives/Project";
import {User} from "~~/primitives/User";
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

    createUserToken(user: User): Promise<Token> {
        const uuid = new UUID();

        if (this.memoryCache.has(uuid.toString())) {
            // Recurse if found
            return this.createUserToken(user);
        }

        this.memoryCache.set(uuid.toString(), user.toString());

        return Promise.resolve({
            accessToken: uuid.toString(),
            expiredAt: new Date(0)
        });
    }

    validateUserToken(token: string): Promise<User> {
        if (!this.memoryCache.has(token)) throw new UnauthenticatedError();

        const rawPayload = this.memoryCache.get<string>(token);

        if (rawPayload === undefined) throw new UnauthenticatedError();

        const payload = User.fromJSONString(rawPayload);

        return Promise.resolve(payload);
    }
}