const router = require("express-promise-router")();
const client = require("../client");
const util = require("util");

router.get("/groups", async (req, res) => {
	const grouped = await client.getGroupedClients();
	const response = [];

	for(const [id, info] of grouped) {
		response.push({
			id,
			name: info.groupName
		})
	}


	res.status(200).send(response);
});



module.exports = router;
