import pg from "pg";
import {IUserRepository} from "~/application/interfaces/IUserRepository";
import {User} from "~/primitives/User";
import {InvalidArgumentError} from "~/errors/InvalidArgumentError";
import Cursor from "pg-cursor";
import {NotFoundError} from "~/errors/NotFoundError";
import {UUID} from "~/primitives/UUID";

export class UserClient implements IUserRepository {
    constructor(private readonly database: pg.Pool) {
        if (database == null) throw new InvalidArgumentError("database is null or undefined");
    }

    async create(user: User): Promise<void> {
        const userId = UUID.v4();
        const connection = await this.database.connect();
        try {
            await connection.query("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ WRITE");

            await connection.query(
                `INSERT INTO human_users (id,
                                          github_id,
                                          github_node_id,
                                          username,
                                          name,
                                          avatar_url,
                                          profile_url,
                                          created_at,
                                          created_by,
                                          updated_at,
                                          updated_by)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $7, $8)`,
                [
                    userId,
                    user.id,
                    user.nodeId,
                    user.username,
                    user.name,
                    user.avatarUrl,
                    user.profileUrl,
                    new Date(),
                    userId,
                ],
            );

            await connection.query("COMMIT");
        } catch (error: unknown) {
            await connection.query("ROLLBACK");

            throw error;
        } finally {
            connection.release();
        }
    }

    async getByUsername(username: string): Promise<User> {
        const connection = await this.database.connect();

        try {
            await connection.query("BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED READ ONLY");

            const queryResult = connection.query(new Cursor(
                `SELECT github_id,
                        github_node_id,
                        username,
                        name,
                        avatar_url,
                        profile_url
                 FROM human_users
                 WHERE username = $1
                 LIMIT 1`,
                [username]
            ));

            const rows = await queryResult.read(1);

            if (rows.length === 0) {
                throw new NotFoundError(`${username} was not found`);
            }

            let user: User | undefined;
            for (const row of rows) {
                if (row === undefined) throw new NotFoundError(`${username} returned null`);

                user = new User(
                    row.github_id,
                    row.github_node_id,
                    row.username,
                    row.name,
                    row.avatar_url,
                    row.profile_url);
            }

            await connection.query("COMMIT");

            if (user === undefined) throw new NotFoundError(`${username} was not found`)

            return user;
        } catch (error: unknown) {
            await connection.query("ROLLBACK");

            throw error;
        } finally {
            connection.release();
        }
    }

    async listAll(): Promise<User[]> {
        const connection = await this.database.connect();

        try {
            await connection.query("BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED READ ONLY");

            const queryResult = connection.query(new Cursor(
                `SELECT github_id,
                        github_node_id,
                        username,
                        name,
                        avatar_url,
                        profile_url
                 FROM human_users`
            ));

            const rows = await queryResult.read(Number.MAX_SAFE_INTEGER);

            if (rows.length === 0) {
                return [];
            }

            const users: User[] = [];
            for (const row of rows) {
                if (row === undefined) continue;

                const user = new User(
                    row.github_id,
                    row.github_node_id,
                    row.username,
                    row.name,
                    row.avatar_url,
                    row.profile_url);

                users.push(user);
            }

            await connection.query("COMMIT");

            return users;
        } catch (error: unknown) {
            await connection.query("ROLLBACK");

            throw error;
        } finally {
            connection.release();
        }
    }

    async migrate(): Promise<void> {
        const connection = await this.database.connect();

        try {
            await connection.query("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE");

            await connection.query(`CREATE TABLE IF NOT EXISTS human_users
                                    (
                                        id             UUID PRIMARY KEY,
                                        github_id      INTEGER      NOT NULL,
                                        github_node_id VARCHAR(255) NOT NULL,
                                        username       VARCHAR(255) NOT NULL,
                                        name           VARCHAR(255) NOT NULL,
                                        avatar_url     TEXT                  DEFAULT NULL,
                                        profile_url    TEXT         NOT NULL,
                                        created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
                                        created_by     UUID         NOT NULL,
                                        updated_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
                                        updated_by     UUID         NOT NULL
                                    )`);

            await connection.query("CREATE UNIQUE INDEX IF NOT EXISTS human_users_github_id_unique ON human_users (github_id)");

            await connection.query("CREATE INDEX IF NOT EXISTS human_users_username_search ON human_users (username NULLS LAST)");

            await connection.query("COMMIT");
        } catch (error: unknown) {
            await connection.query("ROLLBACK");

            throw error;
        } finally {
            connection.release();
        }
    }

    async remove(loginUsername: string): Promise<void> {
        const connection = await this.database.connect();
        try {
            await connection.query("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ WRITE");

            await connection.query(
                `DELETE
                 FROM human_users
                 WHERE username = $1`,
                [loginUsername],
            );

            await connection.query("COMMIT");
        } catch (error: unknown) {
            await connection.query("ROLLBACK");

            throw error;
        } finally {
            connection.release();
        }
    }
}