const APIError = require("./util/APIError");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const database = require("./database");
const app = express();
const SonosNetwork = require("./sonos/SonosNetwork");
const SonosClient = require("./sonos/SonosClient");
const { isProduction } = require("./config");

(async function() {
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

	const sonosNetwork = new SonosNetwork();
	const clients = new Map();

	sonosNetwork.addListener("groupChange", (groupId) => {
		
	})

	sonosNetwork.addListener("groupCreate", (groupId) => {
		const coordinator = sonosNetwork.getCoordinatorForGroup(groupId);

		const client = new SonosClient(coordinator, groupId);
		client.start();
		clients.set(groupId, client);
	});

	sonosNetwork.addListener("groupDestroy", (groupId) => {
		clients.get(groupId).stop();
		clients.delete(groupId);
	});

	await sonosNetwork.init();

	if(!isProduction) {
		app.use((req, res, next) => {
			res.setHeader("Access-Control-Allow-Origin", "*");
			next();
		})
	}

	app.use((req, res, next) => {
		res.locals.clients = clients;
		res.locals.sonosNetwork = sonosNetwork;
		next();
	});

	app.use(cookieParser());

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());

	app.use("/account", require("./routes/account"));
	app.use("/spotify", require("./routes/spotify"));

	app.use(require("./middlewares/authentication"));

	app.use("/info", require("./routes/info"));
	app.use("/queue", require("./routes/queue"));
	app.use("/control", require("./routes/control"));
	app.use("/volume", require("./routes/volume"));

	app.use(async (error, req, res, next) => {
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
	})


	app.listen(5000);
})();

