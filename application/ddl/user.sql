CREATE TABLE human_users
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
);

CREATE UNIQUE INDEX human_users_github_id_unique ON human_users (github_id);

CREATE INDEX human_users_username_search ON human_users (username NULLS LAST);