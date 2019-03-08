const APIError = require("./APIError");

function throwIfNaN(field, number) {
	if(isNaN(number)) {
		throw new APIError(400, `${field} is not a number`);
	}
}

function throwIfNotString(field, string) {
	if(typeof string !== "string") {
		throw new APIError(400, `${field} is not a string`);
	}

}

function throwIfNotStringOrEmpty(field, string) {
	throwIfNotString(field, string);

	if(string.length === 0) {
		throw new APIError(400, `${field} string is empty`);
	}
}

function throwIfNotSpotifyUri(field, string) {
	throwIfNotStringOrEmpty(field, string);

	if(!string.startsWith("spotify:track:")) {
		throw new APIError(400, `${field} is not a valid spotify track uri`);
	}
}

function throwIfNotValidPassword(string) {
	throwIfNotString("password", string);

	if(string.length < 10) {
		throw new APIError(400, "Password can't be shorter than 10 chars");
	}
}

function throwIfNotValidUsername(string) {
	throwIfNotString("username", string);

	if(string.length < 2) {
		throw new APIError(400, "Username can't be shorter than 2 chars");
	}
}

function throwIfNotSonosGroupId(string) {
	throwIfNotStringOrEmpty("groupId", string);

	if(!strings.startsWith("RINCON_") || !string.includes(":")) {
		throw new APIError(400, "Bad group id");
	}
}

module.exports = {
	throwIfNaN,
	throwIfNotString,
	throwIfNotStringOrEmpty,
	throwIfNotSpotifyUri,
	throwIfNotValidPassword,
	throwIfNotValidUsername,
	throwIfNotSonosGroupId
};
