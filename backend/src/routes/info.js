const router = require("express-promise-router")();
const { throwIfNotSonosGroupId } = require("../util/validation");
const database = require("../database");

router.get("/groups", async (req, res) => {
	const groups = res.locals.sonosNetwork.getGroupInfo();
	res.status(200).send(groups);
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
