const router = require("express-promise-router")();
const { throwIfNotSonosGroupId, throwIfNaN } = require("../util/validation");
const SonosClient = require("../sonos/SonosClient");
const APIError = require("../util/APIError");

router.get("/:groupId", async (req, res) => {
	const groupId = req.params.groupId;
	throwIfNotSonosGroupId(groupId);

	let volume;

	try {
		const coordinator = res.locals.sonosNetwork.getCoordinatorForGroup(groupId);
		const client = new SonosClient(coordinator, groupId);
		volume = await client.getVolume();
	} catch(error) {
		throw new APIError(404, "No group with this id")
	}

	res.status(200).send({
		volume
	});
});

router.patch("/:groupId", async (req, res) => {
	const groupId = req.params.groupId;
	throwIfNotSonosGroupId(groupId);
	const newVolume = req.body.volume;
	throwIfNaN("volume", newVolume);

	try {
		const coordinator = res.locals.sonosNetwork.getCoordinatorForGroup(groupId);
		const client = new SonosClient(coordinator, groupId);
		await client.setVolume(newVolume)
	} catch(error) {
		throw new APIError(404, "No group with this id")
	}

	res.status(200).send();
});

module.exports = router;
