const database = require("../database");

class Scheduler {

	constructor(client) {
		this.client = client;
	}

	spotifyUriToSonosUri(uri) {
		return `x-sonos-spotify:${encodeURIComponent("spotify:track:" + uri)}?sid=9`;
	}

	start() {
		this.schedule();
	}

	stop() {
		clearTimeout(this.playTimeout);
	}

	get groupId() {
		return this.client.getGroupId();
	}

	async onSongFinishPlaying(songId) {
		await database.QueuedSong.update({
			state: database.SONG_STATE.FINISHED
		}, {
			where: {
				id: songId
			}
		});
	}

	async schedule() {
		const groupId = this.groupId;

		const [count, nextSong] = await Promise.all([
			database.QueuedSong.count({
				where: {
					groupId,
					state: database.SONG_STATE.PLAYING
				}
			}),
			database.QueuedSong.findOne({
				where: {
					groupId,
					state: database.SONG_STATE.QUEUED
				},
				order: [
					["priority", "DESC"]
				],
			})
		]);

		const isPlaying = count > 0;
		if(!isPlaying && nextSong !== null) {
			const sonosUri = this.spotifyUriToSonosUri(nextSong.spotifyId);

			await this.client.playSong(sonosUri, () => {
				this.onSongFinishPlaying(song.id);
			});

			await database.QueuedSong.update({
				state: database.SONG_STATE.PLAYING
			}, {
				where: {
					id: nextSong.id,
				}
			});
		} 

		this.playTimeout = setTimeout(() => {
			this.schedule();
		}, 500);
	}

}

module.exports = Scheduler;