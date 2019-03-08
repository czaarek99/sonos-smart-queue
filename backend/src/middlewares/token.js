const APIError = require("../util/APIError");
const database = require("../database");

function accessTokenMiddleware(req, res, next) {
    const spotifyAccessToken = req.headers.spotifytoken;

    if(spotifyAccessToken === undefined) {
        throw new APIError(400, "Please supply a spotify access token")
    }

    res.locals.spotifyAccessToken = spotifyAccessToken;
    next();
}

async function refreshTokenMiddleware(req, res, next) {
    const refreshToken = await database.SpotifyRefreshToken.findOne({
        where: {
            userId: req.session.userId
        }
    });

    if(refreshToken === null) {
        throw new APIError(404, "No refresh token found");
    }

    res.locals.spotifyRefreshToken = refreshToken.token
    await next();
}

module.exports = {
    accessTokenMiddleware,
    refreshTokenMiddleware
}