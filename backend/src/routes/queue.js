const router = require("express-promise-router")();
const database = require("../database");
const { throwIfNotSonosGroupId, throwIfNotStringOrEmpty } = require("../util/validation");
const { getBaseClient } = require("../spotify/client");
const { accessTokenMiddleware, refreshTokenMiddleware } = require("../middlewares/token");
const { sse, sseHub, Hub } = require("@toverux/expresse");
const MAX_QUEUE_RETURN = 50;

const queueHub = new Hub();

async function getQueue() {
	const songs = await database.QueuedSong.findAll({
		attributes: [
			"name",
			"albumName",
			"albumArtUrl",
			"artistName",
			"groupId"
		],
		where: {
			state: database.SONG_STATE.QUEUED,
		},
		order: [
			["priority", "DESC"]
		],
		limit: MAX_QUEUE_RETURN
	});

	const queue = {};
	for(const song of songs) {
		const strippedSong = {
			name: song.name,
			albumName: song.albumName,
			albumArtUrl: song.albumArtUrl,
			artistName: song.artistName
		};

		const groupId = song.groupId;
		if(groupId in queue) {
			queue[groupId].push(strippedSong)
		} else {
			queue[groupId] = [strippedSong];
		}
	}

	return queue;
}

router.get("/list", sseHub({ flushAfterWrite: true, hub: queueHub }), (req, res) => {
	console.log("Broadcast!");
	res.sse.broadcast.event("message", "bro");
});

router.use(accessTokenMiddleware);
router.use(refreshTokenMiddleware);

function getAlbumArtUrl(images) {
	if(images.length > 0) {
		return images[0].url;
	}

	return null;
}

router.put("/add/:groupId/", async (req, res) => {
	const groupId = req.params.groupId;
	throwIfNotSonosGroupId(groupId);
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
		state: database.SONG_STATE.QUEUED,
		groupId,
		priority,
	}

	const songsToInsert = [];
	if(type === "album") {
		const response = await client.getAlbum(id);
		const album = response.body;
		console.log("test");
		for(const song of album.tracks.items) {
			const albumArtUrl = getAlbumArtUrl(album.images);

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
		const songToDatabase = (song) => {
			songsToInsert.push({
				...baseObject,
				name: song.name,
				artistName: song.artists[0].name,
				albumName: song.album.name,
				spotifyId: song.id,
				albumArtUrl: getAlbumArtUrl(song.album.images)
			})
		}

		if(type === "song") {
			const response = await client.getTrack(id);
			const song = response.body;
			songToDatabase(song);
		} else if(type === "playlist") {
			const response = await client.getPlaylist(id);
			const playlist = response.body;

			for(const song of playlist.tracks.items) {
				songToDatabase(song.track)
			}
		} else if(type === "artist") {
			const response = await client.getArtistTopTracks(id, "SE");
			const topTracks = response.body;
			for(const song of topTracks.tracks) {
				songToDatabase(song);
			}
		}
	}

	await database.QueuedSong.bulkCreate(songsToInsert);

	const queue = await getQueue();
	queueHub.event("updateQueue", queue);

	res.status(200).send();
});

module.exports = router;
