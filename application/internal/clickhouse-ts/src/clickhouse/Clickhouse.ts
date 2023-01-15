/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  JSONFormatRow,
  Connection,
  Options,
  QueryOptions
} from './interface'

import { HttpClientResponse } from '../httpClient'
import { jsonInsertFormatToSqlValues, jsonRowsToInsertFormat } from '../utils'
import {HttpFetchClient} from "../httpClient/http-fetch-client";

/**
 * Clickhouse is a simple client for making queries and getting responses
 */
export class Clickhouse {
  readonly #httpClient: HttpFetchClient
  readonly #options: Options

  /**
   * Create Clickhouse instance
   *
   * @param {Connection} connection
   * @param {Options} options
   */
  constructor (
    connection: Connection,
    options: Options
  ) {
    this.#options = options
    this.#httpClient = new HttpFetchClient({
      connectionOptions: connection,
      clickhouseSettings: this.#options.clickhouseSettings
    })
  }

  /**
   * Make insert query
   * Auto validating data
   *
   * @param {string} table table name
   * @param {InsertRows} rows insert rows in JSON format
   * @param {InsertQueryOptions} options insert options
   *
   * @returns {Promise<number>} insert count
  */
  public async insert (
    table: string,
    rows: JSONFormatRow[],
    options: QueryOptions = {}
  ): Promise<number> {
    if (rows.length === 0) {
      return 0
    }

    const jsonInsertFormat = jsonRowsToInsertFormat(rows)

    await this.#httpClient.request({
      params: { query: `INSERT INTO ${table} (${jsonInsertFormat.keys.join(',')}) VALUES ` },
      data: jsonInsertFormatToSqlValues(jsonInsertFormat),
      queryOptions: options
    })

    return rows.length
  }

  /**
   * Select query for getting results
   * There is no anu wrapper for response. So, you can do what you want with response
   *
   * @param {string} query WITH now() as time SELECT time;
   * @param {SelectQueryOptions} options select options
   *
   * @returns {Promise<HttpClientResponse>}
  */
  public query<T>(
    query: string,
    options: QueryOptions = {}
  ): Promise<HttpClientResponse<T>> {
    const SQL = `${query} ${options.noFormat ? "" : "FORMAT JSON"}`.trim()

    return this.#httpClient.request<T>({ data: SQL })
  }
}
