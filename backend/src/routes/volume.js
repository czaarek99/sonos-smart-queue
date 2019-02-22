const router = require("express-promise-router")();
const { groupIdToSonos } = require("../util/router");

router.get("/:groupId", async (req, res) => {

	const sonos = await groupIdToSonos(req.params.groupId);
	const volume = await sonos.getVolume();
	res.status(200).send({
		volume
	});
});

router.patch("/:groupId", async (req, res) => {
	res.status(501).send();
	//TODO: https://github.com/bencevans/node-sonos/issues/373
});

module.exports = router;
