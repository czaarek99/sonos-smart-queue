const router = require("express-promise-router")();
const { getMainDevice } = require("../client");
const APIError = require("../util/APIError");

router.get("/", async (req, res) => {
	const device = await getMainDevice();
	const library = await sonos.getMusicLibrary("playlists", {
		start: 0,
		total: 10
	});

	console.log(library);
	res.status(200).send("works");
})

module.exports = router;
