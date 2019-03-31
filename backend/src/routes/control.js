const router = require("express-promise-router")();
const { throwIfNotSonosGroupId } = require("../util/validation");
const APIError = require("../util/APIError");

router.post("/pause", async (req, res) => {
	const groupId = req.body.groupId;
	throwIfNotSonosGroupId(groupId);

	if(!res.locals.clients.has(groupId)) {
		throw new APIError(404, "No group with this id")
	} 

	const client = res.locals.clients.get(groupId);
	await client.pause();

	res.status(200).send();
});

router.post("/play", async (req, res) => {
	const groupId = req.body.groupId;
	throwIfNotSonosGroupId(groupId);

	if(!res.locals.clients.has(groupId)) {
		throw new APIError(404, "No group with this id")
	} 

	const client = res.locals.clients.get(groupId);
	await client.play();

	res.status(200).send();
});

module.exports = router;