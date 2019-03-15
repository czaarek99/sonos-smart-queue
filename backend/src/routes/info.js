const router = require("express-promise-router")();
const client = require("../client");
const util = require("util");

//Application has to cache this
router.get("/groups", async (req, res) => {
	/*const grouped = await client.getGroupedClients();
	const response = [];

	for(const [id, info] of grouped) {
		response.push({
			id,
			speakers: info.speakers
		})
	}

	res.status(200).send(response);*/
	res.status(200).send([
		{
			id: "0",
			speakers: [
				{
					name: "A speaker in a group",
					id: "1"
				}
			]
		}
	]);
});



module.exports = router;
