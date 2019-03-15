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

	private async request(url: string, method: RequestMethod, body?: object, headers?: HeadersInit) : Promise<Response> {
		let extraHeaders = {};

		if(headers) {
			extraHeaders = headers;
		}

		const config : RequestInit = {
			method,
			headers: {
				...this.headers,
				...extraHeaders
			}
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

	public async get(url: string, headers?: HeadersInit) : Promise<Response> {
		return await this.request(url, "GET", undefined, headers);
	}

	public async post(url: string, body: object, headers?: HeadersInit) : Promise<Response> {
		return await this.request(url, "POST", body, headers)
	}

	public async put(url: string, body: object, headers?: HeadersInit) : Promise<Response> {
		return await this.request(url, "PUT", body, headers);
	}

	public async patch(url: string, body: object, headers?: HeadersInit) : Promise<Response> {
		return await this.request(url, "PATCH", body, headers)
	}

}