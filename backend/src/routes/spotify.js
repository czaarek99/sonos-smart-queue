const router = require("express-promise-router")();
const SpotifyWebApi = require("spotify-web-api-node");
const database = require("../database");
const APIError = require("../util/APIError");
const { throwIfNotStringOrEmpty } = require("../util/validation");
const { spotifyQueueSecret, spotifyRedirectUri,isProduction } = require("../config");

const scopes = ["playlist-read-private", "playlist-read-collaborative", "user-read-email"];

function getBaseClient(options = {}) {
    return new SpotifyWebApi({
        redirectUri: `${spotifyRedirectUri}/spotify/redirect`,
        clientId: "66587271d5af4788852dbfe82a7d6364",
        clientSecret: spotifyQueueSecret,
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
            token: data.body.refresh_token,
            userId: user.id
        });

        if(isProduction) {
            res.redirect("/");
        } else {
            res.redirect("http://localhost:3000")
        }
    }

});

router.use(async (req, res, next) => {
    const refreshToken = await database.RefreshToken.findOne({
        where: {
            userId: req.session.userId
        }
    });

    if(refreshToken === null) {
        throw new APIError(404, "No refresh token found");
    }

    res.locals.refreshToken = refreshToken.token
    await next();
});

router.get("/token", async (req, res) => {
    const client = getBaseClient({
        refreshToken: res.locals.refreshToken
    });

    try {
        const data = await client.refreshAccessToken();
        res.status(200).send({
            token: data.body.access_token,
            expiresIn: data.body.expires_in / 2
        });
    } catch(error) {
        throw new APIError(401, "Could not refresh access token")
    }
});

router.get("/search/:query", async(req, res) => {
    const accessToken = req.query.accessToken;
    throwIfNotStringOrEmpty("accessToken", accessToken);
    const query = req.params.query;
    throwIfNotStringOrEmpty("query", query);

    const client = getBaseClient({
        refreshToken: res.locals.refreshToken,
        accessToken
    });

    const response = await client.search(query, ["album", "artist", "track", "playlist"], {
        limit: 50
    });

    res.status(200).send(response);

});

module.exports = router;