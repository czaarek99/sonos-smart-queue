import { FETCH_JSON_HEADERS } from "../constants";

interface IDefaultErrorBody {
    message: string
    status: number
}

export class HttpError<T = IDefaultErrorBody> {

    public readonly statusCode: number;
    public readonly body: T;

    constructor(statusCode: number, body: T) {
        this.statusCode = statusCode;
        this.body = body;
    }

}

type RequestMethod = "POST" | "GET" | "PUT" | "PATCH"

export class FetchClient {

    private readonly headers: HeadersInit;

    constructor(headers: HeadersInit) {
        this.headers = headers;
    }

    private async request(url: string, method: RequestMethod, body?: object) : Promise<Response> {
        const config : RequestInit = {
            method,
            headers: this.headers
        };

        if(body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);

        if(!response.ok) {
            const json = await response.json();
            throw new HttpError(response.status, json);
        }

        return response;
    }

    public async get(url: string) : Promise<Response> {
        return await this.request(url, "GET");
    }

    public async post(url: string, body: object) : Promise<Response> {
        return await this.request(url, "POST", body)
    }

    public async put(url: string, body: object) : Promise<Response> {
        return await this.request(url, "PUT", body)
    }

    public async patch(url: string, body: object) : Promise<Response> {
        return await this.request(url, "PATCH", body)
    }

}