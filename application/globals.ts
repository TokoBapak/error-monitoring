/**
 * This file contains global variables that can be reused throughout the repository.
 * Only the service layers are made public. Repository layers should be left unexported.
 */

import {Authentication} from "~/application/services/Authentication";
import {SimpleMemoryCache} from "~/application/repositories/SimpleMemoryCache";
import {ErrorLogClient} from "~/application/repositories/ErrorLogClient";
import {clickhouseClient, postgresClient} from "~/application/clients";
import {ProjectClient} from "~/application/repositories/ProjectClient";
import {RollbarWriter} from "~/application/services/RollbarWriter";
import {GithubClient} from "~/application/repositories/GithubClient";
import {UserService} from "~/application/services/User";
import {UserClient} from "~/application/repositories/UserClient";
import {TokenClient} from "~/application/repositories/TokenClient";

const rollbarWriter = new RollbarWriter(
    new Authentication(new SimpleMemoryCache()),
    new ErrorLogClient(clickhouseClient),
    new ProjectClient(postgresClient),
);

const githubClient = new GithubClient(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET
);

const userRepository = new UserClient(postgresClient);
const tokenRepository = new TokenClient(new SimpleMemoryCache(-1));

export const userService = new UserService(userRepository, githubClient, tokenRepository);