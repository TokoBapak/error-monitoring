import {type ITokenRepository} from "~/application/interfaces/ITokenRepository";
import {type ICache} from "~/application/interfaces/ICache";
import {InvalidArgumentError} from "~/errors/InvalidArgumentError";
import {type Token} from "~/primitives/Token";
import {UUID} from "~/primitives/UUID";
import {User} from "~/primitives/User";
import {UnauthenticatedError} from "~/errors/UnauthenticatedError";

const REVOKED = "REVOKED";
const DAY_SECONDS = 86_400; // 1 day in seconds

export class TokenClient implements ITokenRepository {
    constructor(private readonly store: ICache) {
        if (store == null) throw new InvalidArgumentError("store is null or undefined");
    }

    generate(user: User): Token {
        // Generate a UUID.
        const id = UUID.v7();

        // Check if the id is being used
        if (this.store.has(id.toString())) {
            // Do a recursive generate
            return this.generate(user);
        }

        // Insert user to store
        this.store.set(id.toString(), user.toString(), DAY_SECONDS);

        return {
            accessToken: id.toString(),
            expiredAt: new Date(Date.now() + (DAY_SECONDS * 1000))
        }
    }

    acquire(token: string): User {
        const stringifiedUser = this.store.get<string>(token);
        if (stringifiedUser === undefined) throw new UnauthenticatedError();
        if (stringifiedUser === REVOKED) throw new UnauthenticatedError();

        return User.fromJSONString(stringifiedUser)
    }

    revoke(token: string): void {
        if (!this.store.has(token)) return;

        this.store.set(token, REVOKED, DAY_SECONDS * 7);
    }
}