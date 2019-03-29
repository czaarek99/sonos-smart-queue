const { DeviceDiscovery, Sonos } = require("sonos");

class SonosClient {

	constructor() {
		this.speakerGroups = new Map();
		this.currentlyPlaying = new Map();
	}

	async getMainDevice() {
		return new Promise((resolve) => {
			DeviceDiscovery().once("DeviceAvailable", (device) => {
				resolve(device);
			});
		})
	}

	async initialize() {
		this.recache();

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

	getCurrentlyPlaying(groupId) {
		return this.currentlyPlaying.get(groupId);
	}

	getCoordinatorByGroupId(groupId) {
		const device = this.getDeviceByGroupId(groupId);
		if(device === null) {
			return null;
		} else {
			return device.coordinator;
		}
	}

	async recache() {
		const mainDevice = await this.getMainDevice();
		const groups = await mainDevice.getAllGroups();

		for(const device of this.speakerGroups.values()) {
			device.coordinator.removeListener("CurrentTrack", device.trackListener)
		}

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

			const onCurrentTrack = (track) => {
				this.currentlyPlaying.set(groupId, {
					name: track.title,
					artistName: track.artist,
					duration: track.duration,
					albumArtUrl: track.albumArtURI
				})
			}

			coordinator.addListener("CurrentTrack", onCurrentTrack)

			this.speakerGroups.set(groupId, {
				coordinator,
				members,
				trackListener: onCurrentTrack
			})
		}
	}

	getZoneMemberIP(zoneMember) {
		return zoneMember.Location.replace("http://", "").replace(":1400/xml/device_description.xml", "");
	}

}

module.exports = new SonosClient();