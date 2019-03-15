const { spotifyQueueSecret, spotifyRedirectUri } = require("../config");
const SpotifyWebApi = require("spotify-web-api-node");

function getBaseClient(options = {}) {
	return new SpotifyWebApi({
		redirectUri: `${spotifyRedirectUri}/spotify/redirect`,
		clientId: "66587271d5af4788852dbfe82a7d6364",
		clientSecret: spotifyQueueSecret,
		...options
	});
}

module.exports.getBaseClient = getBaseClient;