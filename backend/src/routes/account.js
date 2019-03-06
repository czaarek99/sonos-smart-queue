const router = require("express-promise-router")();
const database = require("../database");
const APIError = require("../util/APIError");
const bcrypt = require("bcrypt");
const uuid4 = require("uuid/v4");
const authentication = require("../middlewares/authentication");

const { throwIfNotValidPassword, throwIfNotValidUsername, throwIfNotStringOrEmpty } = require("../util/validation");

async function respondToAuth(res, userId) {
    const accessToken = await database.AccessToken.create({
        token: uuid4(),
        userId
    });

    res.status(200).send(accessToken.token);
}

router.put("/", async(req, res) => {
	const { password, username } = req.body;

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
        password: hashedPassword,
        uuid: uuid4() 
    });

    respondToAuth(res, newUser.id);
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
		respondToAuth(res, user.id)
	} else {
		throwBadDetails();
	}
});

router.get("/tokenStatus", authentication);
router.get("/tokenStatus", async (req, res) => {
    res.status(200).send();
});

module.exports = router;
