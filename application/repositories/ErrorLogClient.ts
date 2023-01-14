import {Clickhouse} from "clickhouse-ts";
import {ErrorEvent} from "~/primitives/ErrorEvent";

export class ErrorLogClient {
    constructor(private readonly client: Clickhouse) {    }

    async migrate(): Promise<void> {
        await this.client.query(
            `CREATE TABLE IF NOT EXISTS error_logs (
                id UUID NOT NULL,
                project UUID NOT NULL,
                environment String NOT NULL,
                level String NOT NULL,
                title String NOT NULL,
                status Uint8 NOT NULL,
                platform Nullable(String),
                language Nullable(string),
                payload String NOT NULL,
                timestamp DateTime NOT NULL
            )
            Engine = MergeTree
            ORDER BY timestamp
            TTL timestamp + INTERVAL 3 MONTH DELETE,`,
            {
                noFormat: true,
            },
        );
    }

    async create(event: ErrorEvent): Promise<void> {
        await this.client.insert(
            "error_logs",
            {
                "id": event.uuid.toString(),
                project: event

            })
    }
 }