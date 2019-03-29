const router = require("express-promise-router")();
const { throwIfNotSonosGroupId } = require("../util/validation");
const SonosClient = require("../client");
const APIError = require("../util/APIError");

router.get("/:groupId", async (req, res) => {
	const groupId = req.params.groupId;
	throwIfNotSonosGroupId(groupId);
	const coordinator = SonosClient.getCoordinatorByGroupId(groupId);

	if(coordinator === null) {
		throw new APIError(404, "No such groupid");
	}

	const volume = await coordinator.getVolume();

	res.status(200).send({
		volume
	});
});

router.patch("/:groupId", async (req, res) => {
	res.status(501).send();
	//TODO: https://github.com/bencevans/node-sonos/issues/373
});

module.exports = router;
