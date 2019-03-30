const router = require("express-promise-router")();
const { throwIfNotSonosGroupId } = require("../util/validation");
const APIError = require("../util/APIError");
const SonosClient = require("../sonos/SonosClient");

router.post("/pause", async (req, res) => {
	const groupId = req.body.groupId;
	throwIfNotSonosGroupId(groupId);

	try {
		const coordinator = res.locals.sonosNetwork.getCoordinatorForGroup(groupId);
		const client = new SonosClient(coordinator, groupId);
		await client.pause();
	} catch(error) {
		throw new APIError(404, "No group with this id")
	}

	res.status(200).send();
});

router.post("/resume", async (req, res) => {
	const groupId = req.body.groupId;
	throwIfNotSonosGroupId(groupId);

	try {
		const coordinator = res.locals.sonosNetwork.getCoordinatorForGroup(groupId);
		const client = new SonosClient(coordinator, groupId);
		await client.play();
	} catch(error) {
		throw new APIError(404, "No group with this id")
	}

	res.status(200).send();
});

module.exports = router;