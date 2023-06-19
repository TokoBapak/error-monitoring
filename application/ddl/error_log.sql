-- See https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/mergetree#table_engine-mergetree-creating-a-table
CREATE TABLE error_logs
(
    id          UUID,
    project     UUID,
    environment String,
    level       String,
    title       String,
    status      UInt8,
    platform    Nullable(String),
    language    Nullable(String),
    payload     String,
    timestamp   DateTime
) Engine = MergeTree()
    ORDER BY (id, timestamp)
    TTL timestamp + INTERVAL 3 MONTH
        DELETE;