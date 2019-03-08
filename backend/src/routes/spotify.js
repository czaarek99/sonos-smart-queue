const router = require("express-promise-router")();
const database = require("../database");
const APIError = require("../util/APIError");
const { throwIfNotStringOrEmpty } = require("../util/validation");
const { isProduction } = require("../config");
const { getBaseClient } = require("../spotify/client");
const authentication = require("../middlewares/authentication");
const { accessTokenMiddleware, refreshTokenMiddleware } = require("../middlewares/token");

const scopes = ["playlist-read-private", "playlist-read-collaborative", "user-read-email"];

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

        await database.SpotifyRefreshToken.create({
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

router.use(authentication);

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

router.use(refreshTokenMiddleware);
router.get("/token", async (req, res) => {
    const client = getBaseClient({
        refreshToken: res.locals.spotifyRefreshToken
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

router.use(accessTokenMiddleware);
router.get("/search/:query", async(req, res) => {
    const query = req.params.query;
    throwIfNotStringOrEmpty("query", query);

    const client = getBaseClient({
        refreshToken: res.locals.spotifyRefreshToken,
        accessToken: res.locals.spotifyAccessToken
    });

    const response = await client.search(query, ["album", "artist", "track", "playlist"], {
        limit: 50
    });

    res.status(200).send(response.body);
});

module.exports = router;