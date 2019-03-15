import { FetchClient } from "../util/FetchClient";
import { FETCH_JSON_HEADERS } from "../constants";

export class BaseService {

	protected readonly client: FetchClient;

	constructor(accessToken: string, headers?: object) {
		this.client = new FetchClient({
			Authorization: accessToken,
			...headers,
			...FETCH_JSON_HEADERS
		})
	}

}