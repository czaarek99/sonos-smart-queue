const router = require("express-promise-router")();
const datbase = require("../database");
const { groupIdToSonos, spotifyUriToSonosUri } = require("../util/router");

const MAX_QUEUE_RETURN = 50;

router.get("/list/:groupId", async (req, res) => {
	//TOOD: Use internal queue
	const sonos = await groupIdToSonos(req.params.groupId);
	const queue = await sonos.getQueue();

	if(queue === false) {
		res.status(202).send({
			total: 0,
			returned: 0,
			songs: []
		});
	} else {
		const queuedSongs = queue.items.slice(0, MAX_QUEUE_RETURN);

		res.status(200).send({
			total: parseInt(queue.total),
			returned: queuedSongs.length,
			songs: queuedSongs
		});

	}
});

router.put("/add", async (req, res) => {
	const { groupId, uri } = req.body;
});

module.exports = router;
