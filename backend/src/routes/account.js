const router = require("express-promise-router")();
const database = require("../database");
const APIError = require("../util/APIError");
const bcrypt = require("bcrypt");
const { throwIfNotValidPassword, throwIfNotValidUsername, throwIfNotStringOrEmpty } = require("../util/validation");

function setLoggedIn(req, res, username, userId) {
    req.session.loggedIn = true;
    req.session.userId = userId;
    res.cookie("loggedIn", true);
    res.cookie("username", username);
    res.status(200).send();
}

router.put("/", async(req, res) => {
	const { password, passwordRepeat, username } = req.body;

	if(password !== passwordRepeat) {
		throw new APIError(400, "Password and repeat are not the same");
	}

	throwIfNotValidPassword(password);
	throwIfNotValidUsername(username);

	const user = await database.User.findOne({
		where: {
			username
		}
	});

	if(user !== null) {
		throw new APIError(409, "Username is taken")
	}

	const hashedPassword = await bcrypt.hash(password, 11);

	const newUser = await database.User.create({
		username,
		password: hashedPassword
	});

	setLoggedIn(req, res, username, newUser.id);
});

router.post("/login", async(req, res) => {
	const { password, username } = req.body;

	throwIfNotStringOrEmpty("password", password);
	throwIfNotStringOrEmpty("username", username);

	const user = await database.User.findOne({
		where: {
			username
		}
	});

	const throwBadDetails = () => {
		throw new APIError(401, "Wrong login details");
	}

	if(user == null) {
		throwBadDetails();
	}

	const passwordMatchesHash = await bcrypt.compare(password, user.password);
	if(passwordMatchesHash) {
		setLoggedIn(req, res, username, user.id)
	} else {
		throwBadDetails();
	}
})

module.exports = router;
