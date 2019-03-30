const router = require("express-promise-router")();
const { throwIfNotSonosGroupId, throwIfNotStringOrEmpty } = require("../util/validation");
const { getBaseClient } = require("../spotify/client");
const { accessTokenMiddleware, refreshTokenMiddleware } = require("../middlewares/token");
const { sseHub } = require("@toverux/expresse");

router.get("/list/:groupId", async (req, res, next) => {
	const groupId = req.params.groupId;
	throwIfNotSonosGroupId(groupId);

	if(!res.locals.clients.has(groupId)) {
		throw new APIError(404, "No group with this id")
	} 

	const client = res.locals.clients.get(groupId);

	const sseMiddleware = sseHub({ flushAfterWrite: true, hub: client.getQueueHub() });
	sseMiddleware(req, res, () => {});
	await client.sendQueueUpdateEvent(false, res.sse.event);
});

router.use(accessTokenMiddleware);
router.use(refreshTokenMiddleware);

router.put("/add/:groupId/", async (req, res) => {
	const groupId = req.params.groupId;
	throwIfNotSonosGroupId(groupId);
	const songId = req.body.id;
	throwIfNotStringOrEmpty("id", songId);
	const type = req.body.type;
	throwIfNotStringOrEmpty("type", type);

	if(!res.locals.clients.has(groupId)) {
		throw new APIError(404, "No group with this id")
	}

	const spotifyClient = getBaseClient({
		refreshToken: res.locals.spotifyRefreshToken,
		accessToken: res.locals.spotifyAccessToken
	});

	const client = res.locals.clients.get(groupId);
	client.addToQueue(spotifyClient, type, songId)

	res.status(200).send();
});

module.exports = router;
