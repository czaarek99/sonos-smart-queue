const router = require("express-promise-router")();
const database = require("../database");
const { throwIfNotSonosGroupId } = require("../util/validation");
const { groupIdToSonos, spotifyUriToSonosUri } = require("../util/router");

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

router.put("/add/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    throwIfNotSonosGroupId(groupId);

    const songId = req.body.songId;
});

module.exports = router;
