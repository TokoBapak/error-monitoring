declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly NODE_ENV: string,
            readonly CLICKHOUSE_URL: string,
            readonly CLICKHOUSE_PORT: string,
            readonly CLICKHOUSE_USER: string,
            readonly CLICKHOUSE_PASSWORD: string,
            readonly CLICKHOUSE_DATABASE: string,
            readonly POSTGRES_HOST: string,
            readonly POSTGRES_PORT: string,
            readonly POSTGRES_USER: string,
            readonly POSTGRES_PASSWORD: string,
            readonly POSTGRES_DATABASE: string
        }
    }
}

export {}