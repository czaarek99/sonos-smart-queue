const router = require("express-promise-router")();
const { throwIfNotSonosGroupId, throwIfNaN } = require("../util/validation");
const SonosClient = require("../sonos/SonosClient");
const APIError = require("../util/APIError");

router.get("/:groupId", async (req, res) => {
	const groupId = req.body.groupId;
	throwIfNotSonosGroupId(groupId);

	if(!res.locals.clients.has(groupId)) {
		throw new APIError(404, "No group with this id")
	} 

	const client = res.locals.clients.get(groupId);
	const volume = await client.getVolume();

	res.status(200).send({
		volume
	});
});

router.patch("/:groupId", async (req, res) => {
	const groupId = req.params.groupId;
	throwIfNotSonosGroupId(groupId);
	const newVolume = req.body.volume;
	throwIfNaN("volume", newVolume);

	if(!res.locals.clients.has(groupId)) {
		throw new APIError(404, "No group with this id")
	} 

	const client = res.locals.clients.get(groupId);
	client.setVolume(newVolume);

	res.status(200).send();
});

module.exports = router;
