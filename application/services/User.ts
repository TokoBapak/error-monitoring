import {IUser} from "~/application/interfaces/IUser";
import {IUserRepository} from "~/application/interfaces/IUserRepository";
import {Token} from "~/primitives/Token";
import {IGithub} from "~/application/interfaces/IGithub";

export class UserService implements IUser {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly githubClient: IGithub,
        ) {
    }

    login(githubCode: string): Promise<Token> {
        return Promise.resolve(undefined);
    }

    logout(accessToken: string): Promise<void> {
        return Promise.resolve(undefined);
    }
}