const router = require("express-promise-router")();
const { groupIdToSonos, spotifyUriToSonosUri } = require("../util/router");
const { throwIfNotSpotifyUri } = require("../util/validation");
const APIError = require("../util/APIError");

router.post("/playSong", async (req, res) => {
	const { groupId, songUri } = req.body;
	throwIfNotSpotifyUri("songUri", songUri);

	const sonos = groupIdToSonos(groupId);
	await sonos.play(spotifyUriToSonosUri());
	res.status(200).send();
});

router.post("/pause", async (req, res) => {
	const groupId = req.body.groupId;
	const sonos = await groupIdToSonos(groupId);
	await sonos.pause();
	res.status(200).send();
});

router.post("/resume", async (req, res) => {
	const groupId = req.body.groupId;
	const sonos = await groupIdToSonos(groupId);
	await sonos.play();
	res.status(200).send();
});

module.exports = router;
