import pg from "pg";
import Cursor from "pg-cursor";
import {IUserRepository} from "~/application/interfaces/IUserRepository";
import {User} from "~/primitives/User";

export class UserClient implements IUserRepository {
    constructor(private readonly database: pg.Pool) {
    }

    create(user: User): Promise<void> {
        return Promise.resolve(undefined);
    }

    getByUsername(username: string): Promise<User> {
        return Promise.resolve(undefined);
    }

    listAll(): Promise<User[]> {
        return Promise.resolve([]);
    }

    migrate(): Promise<void> {
        return Promise.resolve(undefined);
    }

    remove(loginUsername: string): Promise<void> {
        return Promise.resolve(undefined);
    }
}