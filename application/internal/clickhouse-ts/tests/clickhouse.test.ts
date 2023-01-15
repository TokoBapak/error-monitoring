import {describe, it, expect, beforeAll, afterAll} from "vitest";
import { Clickhouse } from '../src/clickhouse'

const instance = new Clickhouse({
    url: process.env.CLICKHOUSE_URL ?? "localhost",
    port: Number(process.env.CLICKHOUSE_PORT ?? "8123"),
    user: process.env.CLICKHOUSE_USER ?? "default",
    password: process.env.CLICKHOUSE_PASSWORD ?? "",
    database: process.env.CLICKHOUSE_DATABASE ?? "default"
}, { defaultFormat: 'JSON' })

describe('clickhouse connection', () => {
  it('should be able to connect', async () => {
    const response = await instance.query('SELECT NOW()')
    expect(response.status).toEqual(200)
  })
})

describe('clickhouse requests', () => {
    beforeAll(async () => {
        await instance.query(`CREATE TABLE IF NOT EXISTS covid (
            id UUID DEFAULT generateUUIDv4(),
            date String,
            PRIMARY KEY (id)
        )
        Engine = MergeTree`,
            { noFormat: true });
        await instance.query("INSERT INTO covid (date) VALUES ('2020-01-01')", { noFormat: true});
    });

    afterAll(async () => {
        await instance.query("DROP TABLE IF EXISTS covid");
    })

    it('should be able to select', async () => {
        const response = await instance.query<{
          database: string
          table: string
        }>('SELECT database, table FROM system.tables LIMIT 10')

        expect(response.status).toEqual(200)
        expect(response.data.rows).toBeGreaterThan(0)
        expect(typeof response.data.data[0]).toEqual('object')
    })

    it('should be able to insert', async () => {
      const insertCount = await instance.insert('covid', [{ date: '2020-01-01' }])
      expect(insertCount).toEqual(1)
    })

    it("empty row insert", async () => {
        const insertCount = await instance.insert("nothing", []);
        expect(insertCount).toEqual(0);
    })
})

describe('clickhouse select formats', () => {
  it('should return JSON', async () => {
    const response = await instance.query('SELECT NOW() as dt', { format: 'JSON' })
    expect(() => {
      JSON.parse(JSON.stringify(response.data.data[0]))
    }).not.toThrowError()
  })
})
