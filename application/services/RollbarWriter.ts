import {IRollbarWriter} from "~/application/interfaces/IRollbarWriter";
import {IAuthentication} from "~/application/interfaces/IAuthentication";
import {IErrorLogRepository} from "~/application/interfaces/IErrorLogRepository";
import {IProjectRepository} from "~/application/interfaces/IProjectRepository";
import {UUID} from "~/primitives/UUID";
import {ErrorEvent} from "~/primitives/ErrorEvent";
import {InvalidProject} from "~/errors/InvalidProject";
import {Authentication} from "~/application/services/Authentication";
import {SimpleMemoryCache} from "~/application/repositories/SimpleMemoryCache";
import {ErrorLogClient} from "~/application/repositories/ErrorLogClient";
import {Clickhouse} from "clickhouse-ts";
import {ProjectClient} from "~/application/repositories/ProjectClient";
import {Pool} from "pg";

export class RollbarWriter implements IRollbarWriter {
    constructor(
        private readonly authentication: IAuthentication,
        private readonly errorLogRepository: IErrorLogRepository,
        private readonly projectRepository: IProjectRepository
    ) {}

    async writeEvent(token: string, event: ErrorEvent): Promise<UUID> {
        // Validate token, acquire project ID from the token.
        const projectId = await this.authentication.validateProjectToken(token);

        // Check if project ID exists.
        const exists = await this.projectRepository.exists(projectId);

        if (!exists) throw new InvalidProject("invalid project: " + projectId.toString());

        // Write to database
        await this.errorLogRepository.create(projectId, event);

        return event.uuid;
    }
}

export const rollbarWriter = new RollbarWriter(
    new Authentication(new SimpleMemoryCache()),
    new ErrorLogClient(
        new Clickhouse({
            url: process.env.CLICKHOUSE_URL ?? "localhost",
            port: Number(process.env.CLICKHOUSE_PORT ?? "8123"),
            user: process.env.CLICKHOUSE_USER ?? "default",
            password: process.env.CLICKHOUSE_PASSWORD ?? "",
            database: process.env.CLICKHOUSE_DATABASE ?? "default"
        }, {defaultResponseFormat: "TSV"})
    ),
    new ProjectClient(new Pool({
        host: process.env.POSTGRES_HOST ?? "localhost",
        port: Number(process.env.POSTGRES_PORT ?? "5432"),
        user: process.env.POSTGRES_USER ?? "tokobapak",
        password: process.env.POSTGRES_PASSWORD ?? "password",
        database: process.env.POSTGRES_DATABASE ?? "error_monitoring"
    })),
);
