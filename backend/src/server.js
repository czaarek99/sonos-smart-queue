const APIError = require("./util/APIError");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const database = require("./database");
const app = express();
const SonosClient = require("./client");
const { spotifyUriToSonosUri } = require("./util/router");

(async function() {
	await SonosClient.initialize();

	await database.sequelize.sync({
		force: false
	})

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

	await database.QueuedSong.update({
		state: database.SONG_STATE.FINISHED
	}, {
		where: {
			state: database.SONG_STATE.PLAYING
		}
	});

	app.listen(5000);

	console.log(SonosClient.getSpeakerGroups());

	for(const groupId of SonosClient.getSpeakerGroups().keys()) {
		playOnGroup(groupId)
	}
})();

async function playOnGroup(groupId) {
	console.log("play on group");
	const song = await database.QueuedSong.findOne({
		where: {
			groupId: groupId,
			state: database.SONG_STATE.QUEUED
		},
		order: [
			["priority", "DESC"]
		],
	});

	if(song === null) {
		console.log("no song")
		setTimeout(playOnGroup, 500);
	} else {
		console.log("found song")
		await SonosClient.playSong(groupId, spotifyUriToSonosUri(song.spotifyId), () => {
			console.log("IMMEDIATE!")
			setImmediate(playOnGroup);
		});

		await database.QueuedSong.update({
			state: database.SONG_STATE.PLAYING
		}, {
			where: {
				id: song.id,
			}
		})
	}
}