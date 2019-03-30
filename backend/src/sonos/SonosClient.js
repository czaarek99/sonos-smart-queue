const { Hub } = require("@toverux/expresse");
const database = require("../database");

const MAX_QUEUE_RETURN = 50;

class SonosClient {

	constructor(coordinator, groupId) {
		this.coordinator = coordinator;
		this.groupId = groupId;
		this.queueHub = new Hub();
		this.controlHub = new Hub();
		this.playing = false;
	}

	spotifyUriToSonosUri(uri) {
		return `x-sonos-spotify:${encodeURIComponent("spotify:track:" + uri)}?sid=9`;
	}

	getQueueHub() {
		return this.queueHub;
	}

	getControlHub() {
		return this.controlHub;
	}

	async play() {
		await this.coordinator.play();
	}

	async pause() {
		await this.coordinator.pause();
	}

	async start() {
		this.playNext();
	}

	async stop() {
		await this.coordinator.flush();
	}

	async getVolume() {
		return await this.coordinator.getVolume();
	}

	async setVolume(volume) {
		throw new Error("Not implemented for all sub devices yet");

		/* 
		Safeguard aginst too high volume
		*/

		if(volume < 0) {
			throw new Error("Volume has to be positive");
		}

		if(volume > 100) {
			throw new Error("Volume can not be higher than 100");
		}

		//Max volume is 50% of sonos max volume
		await this.coordinator.setVolume(volume / 2);
	}

	getAlbumArtUrl(images) {
		if(images.length > 0) {
			return images[0].url;
		}

		return null;
	}

	async addToQueue(spotifyClient, type, songId) {
		const priority = 100;

		const baseObject = {
			state: database.SONG_STATE.QUEUED,
			groupId: this.groupId,
			priority,
		}

		const songsToInsert = [];
		if(type === "album") {
			const response = await spotifyClient.getAlbum(songId);
			const album = response.body;

			for(const song of album.tracks.items) {
				const albumArtUrl = this.getAlbumArtUrl(album.images);

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
					albumArtUrl: this.getAlbumArtUrl(song.album.images)
				})
			}

			if(type === "song") {
				const response = await spotifyClient.getTrack(songId);
				const song = response.body;
				songToDatabase(song);
			} else if(type === "playlist") {
				const response = await spotifyClient.getPlaylist(songId);
				const playlist = response.body;

				for(const song of playlist.tracks.items) {
					songToDatabase(song.track)
				}
			} else if(type === "artist") {
				const response = await spotifyClient.getArtistTopTracks(songId, "SE");
				const topTracks = response.body;
				for(const song of topTracks.tracks) {
					songToDatabase(song);
				}
			}
		}

		await database.QueuedSong.bulkCreate(songsToInsert);
		await this.sendQueueUpdateEvent(true);

		if(!this.playing) {
			this.playNext();
		}
	}

	async getQueue() {
		return await database.QueuedSong.findAll({
			attributes: [
				"name",
				"albumName",
				"albumArtUrl",
				"artistName",
			],
			where: {
				state: database.SONG_STATE.QUEUED,
				groupId: this.groupId
			},
			order: [
				["priority", "DESC"]
			],
			limit: MAX_QUEUE_RETURN
		});
	}

	async getCurrentlyPlaying() {
		return await database.QueuedSong.findOne({
			where: {
				groupId: this.groupId,
				state: database.SONG_STATE.PLAYING
			}
		});
	}

	async sendQueueUpdateEvent(useHub, callback) {
		const eventName = "updateQueue";
		const queue = await this.getQueue();

		if(useHub) {
			this.queueHub.event(eventName, queue);
		} else {
			callback(eventName, queue);
		}
	}

	async sendPlayingUpdateEvent(useHub, callback) {
		const eventName = "updatePlaying";
		const playing = await this.getCurrentlyPlaying();

		const song = {
			playing
		}

		if(useHub) {
			this.controlHub.event(eventName, song);
		} else {
			callback(eventName, song)
		}
	}

	async sendVolumeUpdateEvent(useHub, callback) {
		const eventName = "updateVolume";
		const volume = await this.getVolume();

		const volumeObj = {
			volume
		}

		if(useHub) {
			this.controlHub.event(eventName, volumeObj)
		} else {
			callback(eventName, volumeObj);
		}
	}

	async playNext() {
		const nextSong = await database.QueuedSong.findOne({
			where: {
				groupId: this.groupId,
				state: database.SONG_STATE.QUEUED
			},
			order: [
				["priority", "DESC"]
			],
		});

		if(nextSong !== null) {
			const sonosUri = this.spotifyUriToSonosUri(nextSong.spotifyId);

			await database.QueuedSong.update({
				state: database.SONG_STATE.PLAYING
			}, {
				where: {
					id: nextSong.id,
				}
			});

			await Promise.all([
				this.sendPlayingUpdateEvent(true),
				this.sendQueueUpdateEvent(true),
				this.playSong(sonosUri)
			]);

			await database.QueuedSong.update({
				state: database.SONG_STATE.FINISHED
			}, {
				where: {
					id: nextSong.id
				}
			});

			setImmediate(() => {
				this.playNext();
			});
		} 
	}

	async playSong(songUri) {
		this.playing = true;
		await this.coordinator.flush();
		await this.coordinator.play(songUri);

		return new Promise((resolve) => {
			this.coordinator.once("PlaybackStopped", () => {
				this.playing = false;
				resolve();
			});
		});
	}
}

module.exports = SonosClient;