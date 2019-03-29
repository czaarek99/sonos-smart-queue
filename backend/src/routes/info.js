const router = require("express-promise-router")();
const { throwIfNotSonosGroupId } = require("../util/validation");
const SonosClient = require("../client");
const database = require("../database");
const ApiError = require("../util/APIError");
const util = require("util");

router.get("/groups", async (req, res) => {
	const groups = SonosClient.getSpeakerGroups();
	const response = [];

	for(const [id, device] of groups) {
		response.push({
			id,
			speakers: device.members
		})
	}

	res.status(200).send(response);
});

router.get("/playing/:groupId", async (req, res) => {
	const groupId = req.params.groupId;
	throwIfNotSonosGroupId(groupId);

	const song = await database.QueuedSong.findOne({
		where: {
			groupId,
			state: database.SONG_STATE.PLAYING
		}
	});

	if(song) {
		res.status(200).send({
			name: song.name,
			artistName: song.artistName,
			albumArtUrl: song.albumArtUrl,
		});
	} else {
		res.status(200).send({
			name: "",
			artistName: "",
			albumArtUrl: "/album.png"
		});
	}
});


module.exports = router;
