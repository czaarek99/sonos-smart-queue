const router = require("express-promise-router")();
const SpotifyWebApi = require("spotify-web-api-node");
const database = require("../database");
const APIError = require("../util/APIError");
const { throwIfNotStringOrEmpty } = require("../util/validation");

const scopes = ["playlist-read-private", "playlist-read-collaborative", "user-read-email"];

function getBaseClient() {
    return new SpotifyWebApi({
        redirectUri: "http://00d45574.ngrok.io/spotify/link",
        clientId: "66587271d5af4788852dbfe82a7d6364",
        clientSecret: "3d1928dbe3af4423a39a54f747287263"
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

        await createAccessToken(data);
    }

});

async function createAccessToken(data) {
    //Lets refresh these a minute early
    const expiresInSeconds = data.expires_in - 60;
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresInSeconds);

    await database.AccessToken.create({
        token: data.access_token,
        expirationDate
    });
}

router.get("/link", async (req, res) => {
    const refreshToken = await database.RefreshToken.findOne({
        where: {
            userId: req.session.userId
        }
    });

    if(refreshToken === null) {
        return res.status(404).send({
            exists: false
        });
    }

    const client = getBaseClient();
    client.setRefreshToken(refreshToken);

    try {
        const data = await client.refreshAccessToken();
        await createAccessToken(data);

        res.status(200).send({
            exists: true
        });
    } catch(error) {
        //TODO: Handle this properly
        console.error(error);
        res.status(404).send({
            exists: false
        });
    }
});

module.exports = router;