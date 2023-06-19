CREATE TABLE IF NOT EXISTS project
(
    id             UUID PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    repository_url TEXT         NOT NULL,
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by     UUID         NOT NULL,
    updated_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_by     UUID         NOT NULL
);
