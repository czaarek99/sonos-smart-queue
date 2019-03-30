const { getSonosByGroupId, SonosError } = require("../client");
const { throwIfNotStringOrEmpty } = require("./validation");
const APIError = require("./APIError");

async function groupIdToSonos(groupId) {
	throwIfNotStringOrEmpty("groupId", groupId);

	let sonos;

	try {
		sonos = await getSonosByGroupId(groupId);
	} catch(error) {
		if(error instanceof SonosError) {
			throw new APIError(404, "No such group");
		} else {
			throw error;
		}
	}

	return sonos;
}

function spotifyUriToSonosUri(uri) {
	return `x-sonos-spotify:${encodeURIComponent("spotify:track:" + uri)}?sid=9`;
}

module.exports = {
	groupIdToSonos,
	spotifyUriToSonosUri
}
