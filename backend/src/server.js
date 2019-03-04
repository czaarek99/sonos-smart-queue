const APIError = require("./util/APIError");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const database = require("./database");
const app = express();

(async function() {
	await database.sequelize.sync({
		force: false
	})

	app.use(cookieParser());

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

    app.use("/account", require("./routes/account"));
    app.use("/spotify", require("./routes/spotify"));

    app.use(require("./middlewares/authentication"));

	app.use("/info", require("./routes/info"));
	app.use("/queue", require("./routes/queue"));
	app.use("/search", require("./routes/search"));
	app.use("/control", require("./routes/control"));
    app.use("/volume", require("./routes/volume"));

	app.use(async (error, req, res, next) => {
		if(error instanceof APIError) {
			res.status(error.getStatus()).send(error.toJSON());
		} else {
			console.error(error);
			const logged = await database.logAction(req, "websiteError")

			res.status(500).send({
				message: "Internal server error",
				id: logged.id,
			});
		}
	})

	app.listen(5000);
})();
