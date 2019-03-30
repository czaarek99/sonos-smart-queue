class SonosClient {

	constructor(coordinator, groupId) {
		this.coordinator = coordinator;
		this.groupId = groupId;
	}

	async play(songId) {
		await this.coordinator.play(songId);
	}

	async pause() {
		await this.coordinator.pause();
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

	async playSong(songUri, onFinish) {
		await this.coordinator.flush();
		await this.coordinator.play(songUri);

		this.coordinator.once("PlaybackStopped", () => {
			onFinish();
		});
	}

	getGroupId() {
		return this.groupId;
	}
}

module.exports = SonosClient;