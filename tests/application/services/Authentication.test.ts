import { describe, expect, it } from "vitest";
import { SimpleMemoryCache } from "~~/application/repositories/SimpleMemoryCache";
import { Authentication } from "~~/application/services/Authentication";
import { Project } from "~~/primitives/Project";
import { UUID } from "~~/primitives/UUID";
import {UnauthenticatedError} from "~/errors/UnauthenticatedError";
import {User} from "~/primitives/User";

describe("AuthenticationService", () => {
    const memoryCache = new SimpleMemoryCache();

    it("project token", async () => {
        const project = new Project(new UUID(), "error-monitoring", "https://github.com/TokoBapak/error-monitoring", new Date(), new UUID());

        const authenticationService = new Authentication(memoryCache);
        const token = await authenticationService.createProjectToken(project);
    
        expect(token.accessToken).not.toEqual("");

        const projectEntity = await authenticationService.validateProjectToken(token.accessToken);
        expect(projectEntity.toString()).toStrictEqual(project.toString());
    });

    it("invalid project token", async () => {
        const authenticationService = new Authentication(memoryCache);

        expect(() => authenticationService.validateProjectToken("")).toThrowError(new UnauthenticatedError())
    });

    it("user token", async () => {
        const user = new User(1, "1", "elianiva", "Elianiva", "https://some-avatar.com/elianiva.jpg", "https://github.com/elianiva");

        const authenticationService = new Authentication(memoryCache);
        const token = await authenticationService.createUserToken(user);

        expect(token.accessToken).not.toEqual("");

        const userEntity = await authenticationService.validateUserToken(token.accessToken);
        expect(userEntity.toString()).toStrictEqual(user.toString());
    });

    it("invalid user token", async () => {
        const authenticationService = new Authentication(memoryCache);

        expect(() => authenticationService.validateUserToken("")).toThrowError(new UnauthenticatedError())
    });
})