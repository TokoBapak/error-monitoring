import {afterAll, beforeAll, describe, expect, it} from "vitest";
import {Clickhouse} from "~/application/internal/clickhouse-ts";
import {ErrorLogClient} from "~/application/repositories/ErrorLogClient";
import {UUID} from "~/primitives/UUID";
import {ErrorEvent} from "~/primitives/ErrorEvent";
import {ErrorLevel} from "~/primitives/ErrorLevel";

describe("ErrorLogClient", () => {
    const clickhouseClient = new Clickhouse(
        {
            url: process.env.CLICKHOUSE_URL ?? "localhost",
            port: Number(process.env.CLICKHOUSE_PORT ?? "8123"),
            user: process.env.CLICKHOUSE_USER ?? "default",
            password: process.env.CLICKHOUSE_PASSWORD ?? "",
            database: process.env.CLICKHOUSE_DATABASE ?? "default"
        },
        { defaultFormat: "JSON" }
    );

    const errorLogClient = new ErrorLogClient(clickhouseClient);

    afterAll(async () => {
        await clickhouseClient.query("DROP TABLE IF EXISTS error_logs");
    });

    beforeAll(async () => {
        await errorLogClient.migrate();
    })

    it("should be able to retry the migration", () => {
        expect(errorLogClient.migrate()).resolves.not.toThrowError();
    });

    it("should be able to insert a new log", async () => {
        const projectId = new UUID();

        const errorEvent: ErrorEvent = {
            environment: "production",
            framework: "React",
            language: "Javascript",
            level: ErrorLevel.ERROR,
            payload: {
                body: {
                    message: {
                        body: "Hello world",
                        something: "Awesome!"
                    }
                },
            },
            platform: "Browser",
            timestamp: new Date(),
            title: "Lorem ipsum dolor sit amet",
            uuid: new UUID()
        };

        expect(errorLogClient.create(projectId, errorEvent)).resolves.not.toThrowError();
    })
})