import {Clickhouse} from "~/application/internal/clickhouse-ts";
import pg from "pg";

export const clickhouseClient = new Clickhouse({
    url: process.env.CLICKHOUSE_URL ?? "localhost",
    port: Number(process.env.CLICKHOUSE_PORT ?? "8123"),
    user: process.env.CLICKHOUSE_USER ?? "default",
    password: process.env.CLICKHOUSE_PASSWORD ?? "",
    database: process.env.CLICKHOUSE_DATABASE ?? "default"
}, {defaultFormat: "JSON"});

export const postgresClient = new pg.Pool({
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT ?? "5432"),
    user: process.env.POSTGRES_USER ?? "tokobapak",
    password: process.env.POSTGRES_PASSWORD ?? "password",
    database: process.env.POSTGRES_DATABASE ?? "error_monitoring"
})