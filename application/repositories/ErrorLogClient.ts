import {Clickhouse} from "~/application/internal/clickhouse-ts";
import {ErrorEvent} from "~/primitives/ErrorEvent";
import {UUID} from "~/primitives/UUID";
import {IErrorLogRepository} from "~/application/interfaces/IErrorLogRepository";

export class ErrorLogClient implements IErrorLogRepository {
    constructor(private readonly client: Clickhouse) {    }

    async migrate(): Promise<void> {
        await this.client.query(
            `CREATE TABLE IF NOT EXISTS error_logs (
                id UUID NOT NULL,
                project UUID NOT NULL,
                environment String NOT NULL,
                level String NOT NULL,
                title String NOT NULL,
                status UInt8 NOT NULL,
                platform Nullable(String),
                language Nullable(String),
                payload String NOT NULL,
                timestamp DateTime NOT NULL,
                PRIMARY KEY(timestamp)
            )
            Engine = MergeTree
            ORDER BY timestamp
            TTL timestamp + INTERVAL 3 MONTH DELETE`,
        );
    }

    async create(projectId: UUID, event: ErrorEvent): Promise<void> {
        await this.client.insert(
            "error_logs",
            [{
                "id": event.uuid.toString(),
                project: projectId.toString(),
                environment: event.environment,
                level: event.level.toString(),
                title: event.title,
                status: 0,
                platform: event.platform,
                language: event.language,
                payload: JSON.stringify(event.payload),
                timestamp: event.timestamp,
            }],
        );
    }
 }