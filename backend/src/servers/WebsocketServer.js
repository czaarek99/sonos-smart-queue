const Websocket = require("ws");
const EventEmitter = require("events");
const v4 = require("uuid/v4");

//TODO: Authentication
class WebsocketServer {

	constructor(path, port) {
		this.port = port;
		this.path = path;
		this.clients = new Map();
		this.subscriptions = new Map();
	}

	start() {
		this.server = new Websocket.Server({
			port: this.port,
			path: this.path
		});

		this.server.on("connection", (client) => {
			const uuid = v4();
			client.uuid = uuid;

			this.clients.set(uuid, client);

			client.on("pong", () => {
				this.isAlive = true;
			});

			client.on("message", (message) => {
				if(message.event === "subscribe") {
					client.subscribedTo = message.data.groupId;
					this.emit("newSubscription", uuid, groupId);
				}
			});

			client.on("close", () => {
				this.clients.delete(uuid);
			})
		});

		this.heartbeatInterval = setInterval(() => {
			for(const client of this.server.clients) {
				if(!client.isAlive) {
					client.terminate();
				}

				client.isAlive = false;
				client.ping(() => {});
			}
		});

		this.emit("newConnection", uuid);
	}

	stop() {
		this.server.close();
	}

	send(uuid, event, data) {
		const client = this.clients.get(uuid);
		client.send({
			event,
			data
		})
	}

	broadcast(groupId, event, data) {
		for(const client of this.server.clients) {
			if(groupId === null || client.subscribedTo === groupId) {
				client.send({
					event,
					data
				})
			}
		}
	}
}

module.exports = WebsocketServer;