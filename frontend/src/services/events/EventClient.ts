import WebsocketClient from "ws";
import { string } from "prop-types";

type EventCallback<T> = (data: T) => void

export class EventClient {

	private readonly listeners = new Map<string, EventCallback<any>[]>();
	private readonly websocket: WebsocketClient;
	private pingTimeout: number

	constructor(accessToken: string) {
		const params = new URLSearchParams();
		params.set("authorization", accessToken);

		this.websocket = new WebsocketClient(`ws://localhost:5001/`);

		this.websocket.on("open", () => {
			this.heartbeat();
		});

		this.websocket.on("ping", () => {
			this.heartbeat();
		});

		this.websocket.addEventListener("message", (event) => {
			if(this.listeners.has(event.data.event)) {
				const callbacks = this.listeners.get(event.data.event);
				for(const callback of callbacks) {
					callback(event.data.data);
				}
			}
		})
	}

	private heartbeat() {
		window.clearTimeout(this.pingTimeout);

		this.pingTimeout = window.setTimeout(() => {
			this.websocket.terminate();
			throw new Error("Websocket closed unexcpectedly!");
		}, 30 * 1000);
	}

	public addEventListener<T>(eventName: string, callback: EventCallback<T>) {
		if(this.listeners.has(eventName)) {
			const callbacks = this.listeners.get(eventName);
			callbacks.push(callback);
		} else {
			this.listeners.set(eventName, [callback]);
		}
	}

	public subscribe(groupId: string) {
		this.websocket.send({
			event: "subscribe",
			data: {
				groupId
			}
		});
	}

	public destroy() {
		window.clearTimeout(this.pingTimeout);
		this.websocket.close();
		this.listeners.clear();
	}
}