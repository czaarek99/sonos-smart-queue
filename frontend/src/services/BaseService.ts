import { FetchClient } from "../util/FetchClient";
import { FETCH_JSON_HEADERS } from "../constants";
import { string } from "prop-types";

interface EventCallback<T> {
	eventName: string
	callback: (data: T) => void
}

export class BaseService {

	protected readonly sources = new Map<string, EventSource>();
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

	protected setUpdateCallbacks<T>(url: string, ...callbacks: EventCallback<T>[]) : EventSource {
		const params = new URLSearchParams();
		params.set("authorization", this.accessToken);

		const source = new EventSource(`${url}?${params.toString()}`);

		for(const callback of callbacks) {
			source.addEventListener(callback.eventName, (event: MessageEvent) => {
				callback.callback(JSON.parse(event.data));
			})
		}

		this.sources.set(url, source);
		return source;
	}

	protected destroyEventSource(url: string) {
		if(this.sources.has(url)) {
			this.sources.get(url).close();
			this.sources.delete(url);
		}
	}


}