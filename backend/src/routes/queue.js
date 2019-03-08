const router = require("express-promise-router")();
const database = require("../database");
const { throwIfNotSonosGroupId, throwIfNotStringOrEmpty } = require("../util/validation");
const { groupIdToSonos, spotifyUriToSonosUri } = require("../util/router");
const { getBaseClient } = require("../spotify/client");
const { accessTokenMiddleware, refreshTokenMiddleware } = require("../middlewares/token");

const MAX_QUEUE_RETURN = 50;

const SONG_STATE = {
    QUEUED: "queued",
    STARTED_PLAYING: "started",
    PLAYING: "playing",
    FINISHED: "finished"
};

router.get("/list/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    //throwIfNotSonosGroupId(groupId);

    const today = new Date(new Date().getTime() - (16 * 60 * 60 * 1000));

    const songs = await database.QueuedSong.findAll({
        attributes: [
            "name",
            "albumName",
            "albumArtUrl",
            "artistName"
        ],
        where: {
            groupId: groupId,
            state: SONG_STATE.QUEUED,
            queueDate: {
                [database.Sequelize.Op.gt]: today
            }
        },
        order: [
            ["priority", "DESC"]
        ]
    });

    return res.status(200).send(songs);
});

router.use(accessTokenMiddleware);
router.use(refreshTokenMiddleware);

function getAlbumArtUrl(images) {
    if(images.length > 0) {
        return images[0].url;
    } 

    return null;
}

function songsToDatabase(base, songs) {

    const dbObjects = [];

}

router.put("/add/:groupId/", async (req, res) => {
    const groupId = req.params.groupId;
    //TODO: Add back this check
    //throwIfNotSonosGroupId(groupId);
    const id = req.body.id;
    throwIfNotStringOrEmpty("id", id);
    const type = req.body.type;
    throwIfNotStringOrEmpty("type", type);

    const client = getBaseClient({
        refreshToken: res.locals.spotifyRefreshToken,
        accessToken: res.locals.spotifyAccessToken
    });

    //TODO: Handle priority
    const priority = 100;

    const baseObject = {
        state: SONG_STATE.QUEUED,
        groupId,
        priority,
    }

    const songsToInsert = [];
    if(type === "album") {
        const album = await client.getAlbum(id);

        for(const song of album.tracks) {
            const albumArtUrl = getAlbumArtUrl(song.album.images);

            songsToInsert.push({
                ...baseObject,
                name: song.name,
                artistName: album.artists[0].name,
                albumName: album.name,
                spotifyId: song.id,
                albumArtUrl
            })
        }
    } else {
        const songObjects = [];

        if(type === "song") {
            const response = await client.getTrack(id);
            const song = response.body;
            songObjects.push(song);
        } else if(type === "playlist") {
            const response = await client.getPlaylist(id);
            const playlist = response.body;
            songObjects.push(...playlist.tracks.items);
        } else if(type === "artist") {
            const response = client.getArtistTopTracks(id);
            const topTrack = response.body;
            songObjects.push(...topTracks.tracks);
        }

        for(const song of songObjects) {
            songsToInsert.push({
                ...baseObject,
                name: song.name,
                artistName: song.artists[0].name,
                albumName: song.album.name,
                spotifyId: song.id,
                albumArtUrl: getAlbumArtUrl(song.album.images)
            })
        }

    }

    await database.QueuedSong.bulkCreate(songsToInsert);
    res.status(200).send();
});

module.exports = router;
