const APIError = require("../util/APIError");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const database = require("../database");
const SonosNetwork = require("../sonos/SonosNetwork");
const SonosClient = require("../sonos/SonosClient");
const { isProduction } = require("../config");
const WebsocketServer = require("./WebsocketServer");

class Server {

	constructor(port) {
		this.port = port;
		this.app = express();
		this.clients = new Map();
		this.websocketServer = this.createWebsocketServer();
	}

	async start() {
		await database.sequelize.sync({
			force: false
		});

		await database.QueuedSong.update({
			state: database.SONG_STATE.FINISHED
		}, {
			where: {
				state: database.SONG_STATE.PLAYING
			}
		});

		this.websocketServer.start();
		await this.createSonos();

		if(!isProduction) {
			this.app.use((req, res, next) => {
				res.setHeader("Access-Control-Allow-Origin", "*");
				next();
			})
		}

		this.app.use(cookieParser());

		this.app.use(bodyParser.urlencoded({
			extended: true
		}));

		this.app.use(bodyParser.json());

		this.addRoutes();

		this.app.use(async (error, req, res, next) => {
			this.onError(error, req, res, next)	;
		})

		this.app.listen(this.port);
	}

	createWebsocketServer() {
		const websocketServer = new WebsocketServer(this.port + 1, "/events");

		this.websocketServer.addListener("newConnection", (uuid) => {
			websocketServer.send(uuid, "groupUpdate", )
		});

		this.websocketServer.addListener("newSubscription", (uuid, groupId) => {
			if(clients.has(groupId)) {
				const client = clients.get(groupId);

				const [queue, playing, volume] = Promise.all([
					client.getQueue(),
					client.getCurrentlyPlaying(),
					client.getVolume(),
				])

				websocketServer.send(uuid, "queueUpdate", {
					queue
				});

				websocketServer.send(uuid, "currentlyPlaying", {
					playing
				});

				websocketServer.send(uuid, "volumeUpdate", {
					volume
				});
			}
		});

		return websocketServer;
	}

	async createSonos() {
		const sonosNetwork = new SonosNetwork();

		sonosNetwork.addListener("groupUpdate", (groups) => {
			this.websocketServer.broadcast(null, "groupUpdate", {
				 groups
			});
		});

		sonosNetwork.addListener("groupCreate", (groupId) => {
			const coordinator = sonosNetwork.getCoordinatorForGroup(groupId);
			const client = new SonosClient(coordinator, groupId);

			client.addListener(groupId, "queueUpdate", (queue) => {
				this.websocketServer.broadcast(groupId, "queueUpdate", {
					queue
				})
			});

			client.addListener(groupId, "currentlyPlaying", (playing) => {
				websocketServer.broadcast(groupId, "currentlyPlaying", {
					playing
				})
			});

			client.addListener(groupId, "volumeUpdate", (volume) => {
				websocketServer.broadcast("volumeUpdate", {
					volume
				})
			});

			client.start();
			this.clients.set(groupId, client);
		});

		sonosNetwork.addListener("groupDestroy", (groupId) => {
			this.clients.get(groupId).destroy();
			this.clients.delete(groupId);
		});

		await sonosNetwork.init();

		this.app.use((req, res, next) => {
			res.locals.clients = clients;
			res.locals.sonosNetwork = sonosNetwork;
			next();
		});
	}

	addRoutes() {
		this.app.use("/account", require("../routes/account"));
		this.app.use("/spotify", require("../routes/spotify"));

		this.app.use(require("../middlewares/authentication"));

		this.app.use("/info", require("../routes/info"));
		this.app.use("/queue", require("../routes/queue"));
		this.app.use("/control", require("../routes/control"));
		this.app.use("/volume", require("../routes/volume"));
	}

	async onError(error, req, res, next) {
		if(error instanceof APIError) {
			res.status(error.getStatus()).send(error.toJSON());
		} else {
			console.error(error);
			const logged = await database.logAction(req, "websiteError")

			res.status(500).send({
				message: "Internal server error",
				id: logged.id,
			});
		}
	}
}

module.exports = Server;