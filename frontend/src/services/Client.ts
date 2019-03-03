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

export async function request(url: string, method: RequestMethod, body?: object) : Promise<Response> {
    const config : RequestInit = {
        method,
        headers: FETCH_JSON_HEADERS,
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