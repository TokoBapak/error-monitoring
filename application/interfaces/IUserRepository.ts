import {GithubUser} from "~/application/interfaces/IGithub";

export interface IUserRepository {
    /**
     * Create a new user entry to the database.
     * If the user already exists, it will return
     *
     * @param user
     */
    create(user: GithubUser): Promise<void>;

    /**
     * Remove a user from the database.
     * If the user was not found, it will still be okay.
     * @param loginUsername
     */
    remove(loginUsername: string): Promise<void>;

    /**
     * Query the database for list of users that have access
     * (and technically already accessed) the site.
     */
    listAll(): Promise<GithubUser[]>;

    /**
     * Acquire a user by their username.
     * @param username The user's username.
     * @throws {NotFoundError} if the user does not exist
     */
    getByUsername(username: string): Promise<GithubUser>;
}