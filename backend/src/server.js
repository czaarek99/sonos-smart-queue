const APIError = require("./util/APIError");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const database = require("./database");
const session = require("express-session");
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

	const SequelizeStore = require("connect-session-sequelize")(session.Store);

	const store = new SequelizeStore({
		db: database.sequelize
	});

	await store.sync();

	app.use(session({
		saveUninitialized: false,
		resave: false,
		secret: "5TfP4gwcjZPAR77Wbz9Q",
		store,
		cookie: {
			maxAge: 7 * 24 * 60 * 60 * 1000
		}
	}))

	app.use("/info", require("./routes/info"));
	app.use("/queue", require("./routes/queue"));
	app.use("/search", require("./routes/search"));
	app.use("/control", require("./routes/control"));
	app.use("/volume", require("./routes/volume"));
	app.use("/account", require("./routes/account"));

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
