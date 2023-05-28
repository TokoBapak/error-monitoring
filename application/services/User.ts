import {type IUser} from "~/application/interfaces/IUser";
import {type IUserRepository} from "~/application/interfaces/IUserRepository";
import {type IGithub} from "~/application/interfaces/IGithub";
import {type ITokenRepository} from "~/application/interfaces/ITokenRepository";
import {Token} from "~/primitives/Token";
import {InvalidArgumentError} from "~/errors/InvalidArgumentError";
import {UnauthorizedError} from "~/errors/UnauthorizedError";
import {User} from "~/primitives/User";
import {NotFoundError} from "~/errors/NotFoundError";

export class UserService implements IUser {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly githubClient: IGithub,
        private readonly tokenRepository: ITokenRepository
    ) {
        if (userRepository == null) throw new InvalidArgumentError("userRepository is null or undefined");
        if (githubClient == null) throw new InvalidArgumentError("githubClient is null or undefined");
        if (tokenRepository == null) throw new InvalidArgumentError("tokenRepository is null or undefined");
    }

    async login(githubCode: string): Promise<Token> {
        if (githubCode === "") throw new InvalidArgumentError("githubCode is empty");
        const githubToken = await this.githubClient.accessToken(githubCode);

        // Who is this user?
        const githubUser = await this.githubClient.getAuthenticatedUser(githubToken);

        // Acquire user's organizations
        const githubUserOrganizations = await this.githubClient.getUserOrganization(githubToken);

        // Check if user exists on TokoBapak organization
        const existsOnTokoBapak = githubUserOrganizations.some(organization => organization.login.toLowerCase() === "tokobapak");
        if (!existsOnTokoBapak) throw new UnauthorizedError("Not a TokoBapak member");

        // User exists on TokoBapak organization. We should generate a token.
        const user = new User(githubUser.id, githubUser.node_id, githubUser.login, githubUser.name, githubUser.avatar_url, githubUser.html_url);
        const token = this.tokenRepository.generate(user);

        // We should check the userRepository, if the user exists, we will do immediate return.
        // If they doesn't, we will enter the registration flow.
        try {
            await this.userRepository.getByUsername(user.username);
            return token;
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                // Enter the registration flow
                await this.userRepository.create(user);
                return token;
            }

            // Rethrow error to upper layer
            throw error;
        }
    }

    logout(accessToken: string): Promise<void> {
        return new Promise((resolve) => {
            this.tokenRepository.revoke(accessToken);
            resolve();
        })
    }
}