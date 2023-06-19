import {URL, URLSearchParams} from "node:url";
import {HttpClientConstructor, HttpClientRequest, HttpClientResponse} from './interface'
import {HttpClickhouseAxiosError} from '../errors'

/**
 * HttpClient wraps fetch and provides transparent data transferring between your code and clickhouse server
 * It uses HTTP/1 protocol
 */
export class HttpFetchClient {

    private readonly baseUrl: URL;
    private readonly authorization: string;

    /**
    * https://clickhouse.com/docs/en/operations/settings/settings/
    */
    private readonly clickhouseSettings: Record<string, unknown>

  /**
   * Create HttpClient instance
   *
   * @param {HttpClientConstructor} options
   */
  constructor ({ connectionOptions, clickhouseSettings = {} }: HttpClientConstructor) {
      this.baseUrl = new URL(connectionOptions.database, `http://${connectionOptions.url}:${connectionOptions.port}`)
      this.authorization = `Basic ${Buffer.from(connectionOptions.user + ":" + connectionOptions.password).toString("base64")}`;
      this.clickhouseSettings = clickhouseSettings
  }

  /**
   * Make full axios request and get full Clickhouse HTTP response
   *
   * @param {HttpClientRequest} config request config
   * @returns {Promise<HttpClientResponse>}
   */
  public async request<T>({
    params,
    data = "",
    queryOptions = {}
  }: HttpClientRequest): Promise<HttpClientResponse<T>> {
    const searchParams = new URLSearchParams({
        ...Boolean(params?.query) && { query: params!.query },
        ...this.clickhouseSettings,
        ...queryOptions
    } as unknown as Record<string, never>);


    const requestUrl = new URL("/?" + searchParams.toString(), this.baseUrl).toString();

    const response = await fetch(
        requestUrl,
        {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "Accept": "application/json; charset=UTF-8",
                "Authorization": this.authorization,
            },
            body: data
        }
    );

    if (response.status > 299) {
        const responseBody = await response.text();

        throw new HttpClickhouseAxiosError({
            message: responseBody,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        })
    }


    const rawResponseBody = await response.text();

    let responseBody;

    if (rawResponseBody !== "") {
        responseBody = JSON.parse(rawResponseBody);
    } else {
        responseBody = {
            rows: 0,
            meta: [],
            data: [],
            statistics: {
                elapsed: 0,
                rows_read: 0,
                bytes_read: 0,
            }
        }
    }

    return {
        headers: response.headers,
        data: responseBody,
        status: response.status,
        statusText: response.statusText
    }
  }
}
