const database = require("../database");
const MAX_QUEUE_RETURN = 50;

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

async function sendQueueToHub(hub) {
	const queue = await getQueue();
	hub.event("updateQueue", queue);
}

module.exports = {
	sendQueueToHub,
	getQueue
}