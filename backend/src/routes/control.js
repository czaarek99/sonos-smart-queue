const router = require("express-promise-router")();
const { throwIfNotSonosGroupId } = require("../util/validation");
const APIError = require("../util/APIError");
const SonosClient = require("../client");

router.post("/pause", async (req, res) => {
	const groupId = req.body.groupId;
	throwIfNotSonosGroupId(groupId);

	const coordinator = SonosClient.getCoordinatorByGroupId(groupId);
	if(coordinator === null) {
		throw new APIError(404, "No device by this group id")
	}

	await device.coordinator.pause();
	res.status(200).send();
});

router.post("/resume", async (req, res) => {
	const groupId = req.body.groupId;
	throwIfNotSonosGroupId(groupId);

	const coordinator = SonosClient.getCoordinatorByGroupId(groupId);
	if(coordinator === null) {
		throw new APIError(404, "No device by this group id")
	}

	await coordinator.play();
	res.status(200).send();
});

module.exports = router;
