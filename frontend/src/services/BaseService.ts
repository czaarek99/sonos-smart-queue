import { FetchClient } from "../util/FetchClient";
import { FETCH_JSON_HEADERS } from "../constants";
import { string } from "prop-types";

export class BaseService {

	protected readonly client: FetchClient;
	protected readonly accessToken: string

	constructor(accessToken: string, headers?: object) {
		this.accessToken = accessToken;

		this.client = new FetchClient({
			Authorization: accessToken,
			...headers,
			...FETCH_JSON_HEADERS
		})
	}
}