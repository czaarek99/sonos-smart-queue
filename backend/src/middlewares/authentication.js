const database = require("../database");

module.exports = async function(req, res, next) {
	const accessToken = req.headers.authorization;

	if(accessToken) {
		const token = await database.AccessToken.findOne({
			where: {
				token: accessToken
			}
		});

		if(token) {
			req.session = {
				userId: token.userId
			};

			await next();
		} else {
			res.status(401).send();
		}
	} else {
		res.status(401).send();
	}
}