const router = require("express-promise-router")();
const SpotifyWebApi = require("spotify-web-api-node");
const database = require("../database");
const APIError = require("../util/APIError");
const { throwIfNotStringOrEmpty } = require("../util/validation");

const scopes = ["playlist-read-private", "playlist-read-collaborative", "user-read-email"];

function getBaseClient(options = {}) {
    return new SpotifyWebApi({
        redirectUri: "http://00d45574.ngrok.io/spotify/link",
        clientId: "66587271d5af4788852dbfe82a7d6364",
        clientSecret: "3d1928dbe3af4423a39a54f747287263",
        ...options
    });
}

router.get("/authUrl", async(req, res) => {
    const client = getBaseClient();

    const user = await database.User.findOne({
        where: {
            id: req.session.userId
        }
    });

    const authUrl = client.createAuthorizeURL(scopes, user.uuid);
    res.status(200).send(authUrl);
});

router.get("/redirect", async(req, res) => {
    const { code, state, error } = req.query;

    throwIfNotStringOrEmpty("code", code);
    throwIfNotStringOrEmpty("state", state);

    if(error) {
        throw new APIError(400, "Redirect failed with error: " + error);
    } else {
        const user = await database.User.findOne({
            where: {
                uuid: state
            }
        });

        if(user === null) {
            throw new APIError(404, "No user found with that uuid")
        }

        const client = getBaseClient();
        const data = await client.authorizationCodeGrant(code);

        await database.RefreshToken.create({
            token: data.refresh_token,
            userId: user.id
        });

        res.status(200).send(200);
    }

});

router.get("/token", async (req, res) => {
    const refreshToken = await database.RefreshToken.findOne({
        where: {
            userId: req.session.userId
        }
    });

    if(refreshToken === null) {
        return res.status(404).send();
    }

    const client = getBaseClient({
        refreshToken: refreshToken.token
    });

    try {
        const data = await client.refreshAccessToken();
        res.status(200).send({
            token: data.body.access_token,
            expiresIn: data.body.expies_in / 2
        });
    } catch(error) {
        res.status(401).send();
    }
});

module.exports = router;