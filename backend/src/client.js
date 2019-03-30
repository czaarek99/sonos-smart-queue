const { DeviceDiscovery, Sonos } = require("sonos");

class SonosClient {

	constructor() {
		this.speakerGroups = new Map();
		this.states = new Map();
		this.listeners = new Map();
	}

	async getMainDevice() {
		return new Promise((resolve) => {
			DeviceDiscovery().once("DeviceAvailable", (device) => {
				resolve(device);
			});
		})
	}

	async initialize() {
		await this.recache();

		setInterval(() => {
			this.recache();
		}, 20 * 1000)
	}

	getSpeakerGroups() {
		return this.speakerGroups;
	}

	getDeviceByGroupId(groupId) {
		return this.speakerGroups.get(groupId);
	}

	getCoordinatorByGroupId(groupId) {
		const device = this.getDeviceByGroupId(groupId);
		if(device === null) {
			return null;
		} else {
			return device.coordinator;
		}
	}

	getPlaybackState(groupId) {
		const state = this.states.get(groupId);

		if(state === null) {
			return "stopped"
		} else {
			return state;
		}
	}

	async playSong(groupId, songUri, onFinish) {
		const coordinator = this.getCoordinatorByGroupId(groupId);
		this.states.set(groupId, "playing");
		await coordinator.flush();
		await coordinator.play(songUri);

		coordinator.once("PlaybackStopped", () => {
			console.log("STOPPED BRO")
			this.states.set(groupId, "stopped");
			onFinish();
		});
	}

	async recache() {
		const mainDevice = await this.getMainDevice();
		const groups = await mainDevice.getAllGroups();

		this.speakerGroups.clear();

		for (const group of groups) {
			const groupId = group.ID;
			let coordinatorUrl = null;

			const groupMembers = [];
			if(Array.isArray(group.ZoneGroupMember)) {
				if(group.ZoneGroupMember[0].ZoneName === "BOOST")  {
					continue;
				}

				groupMembers.push(...group.ZoneGroupMember);
			} else {
				groupMembers.push(group.ZoneGroupMember);
			}

			const members = groupMembers.map((member) => {
				if(member.UUID === group.Coordinator) {
					coordinatorUrl = this.getZoneMemberIP(member);
				}

				return {
					id: member.UUID,
					name: member.ZoneName,
				}
			});

			if (coordinatorUrl === null) {
				throw new Error("Could not find coordinator in zone members")
			}

			const coordinator = new Sonos(coordinatorUrl);

			this.speakerGroups.set(groupId, {
				coordinator,
				members
			})
		}
	}

	getZoneMemberIP(zoneMember) {
		return zoneMember.Location.replace("http://", "").replace(":1400/xml/device_description.xml", "");
	}

}

module.exports = new SonosClient();