const router = require("express-promise-router")();
const { sseHub } = require("@toverux/expresse");

router.get("/groups", async (req, res) => {
	const network = res.locals.sonosNetwork;

	const sseMiddleware = sseHub({ flushAfterWrite: true, hub: network.getGroupsHub() });
	sseMiddleware(req, res, () => {});
	network.sendGroupsUpdateEvent(false, res.sse.event);
});

module.exports = router;
