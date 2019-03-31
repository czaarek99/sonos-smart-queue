const { Sonos, DeviceDiscovery } = require("sonos");
const EventEmitter = require("events");

class SonosNetwork extends EventEmitter {

	constructor() {
		super();
		this.devices = new Set();
	}

	async startDiscovery() {
		return new Promise((resolve) => {
			this.discovery = DeviceDiscovery((device) => {
				this.onDiscovery(device);
				resolve();
			});
		})
	}

	async onDiscovery(device) {
		this.devices.add(device);

		clearTimeout(this.cacheTimeout);
		this.cacheTimeout = setTimeout(() => {
			this.recache();
		}, 1000)
	}

	async init() {
		await this.startDiscovery();
		await this.recache();

		this.cacheInterval = setInterval(() => {
			this.recache();
		}, 10 * 1000)
	}

	destroy() {
		this.discovery.destroy();
		clearInterval(this.cacheInterval);
	}

	getGroupInfo() {
		const info = [];

		for(const [id, data] of this.speakerGroups.entries()) {
			info.push({
				id,
				speakers: data.members
			})
		}

		return info;
	}

	getSpeakerGroups() {
		return this.speakerGroups.values();
	}

	getCoordinatorForGroup(groupId) {
		if(this.speakerGroups.has(groupId)) {
			return this.speakerGroups.get(groupId).coordinator;
		}

		throw new Error("No coordinator for group id: " + groupId);
	}

	async getAllGroups() {
		let badDevices = [];
		let groups = null;

		for(const device of this.devices.values()) {
			try {
				groups = await device.getAllGroups();
			} catch(error) {
				badDevices.push(device);

				console.error("Failed to contact device with error:");
				console.error(error);
				console.info("Retrying with next device...")
			}
		}

		if(groups === null) {
			throw new Error("All devices are bad! Can't get groups");
		}

		for(const badDevice of badDevices) {
			this.devices.delete(badDevice);
		}

		return groups;
	}

	async recache() {
		const sonosGroups = await this.getAllGroups();
		const oldSpeakerGroups = new Map(this.speakerGroups);

		for (const group of sonosGroups) {
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
			});
		}

		let groupsHaveChanged = false;

		for(const groupId of oldSpeakerGroups.keys()) {
			if(!this.speakerGroups.has(groupId)) {
				this.emit("groupDestroy", groupId);
				groupsHaveChanged = true;
			}
		}


		for(const groupId of this.speakerGroups.keys()) {
			if(!oldSpeakerGroups.has(groupId)) {
				this.emit("groupCreate", groupId);
				groupsHaveChanged = true;
			}
		}

		if(groupsHaveChanged) {
			this.emit("groupUpdate", this.getGroupInfo());
		}

	}

	getZoneMemberIP(zoneMember) {
		return zoneMember.Location.replace("http://", "").replace(":1400/xml/device_description.xml", "");
	}
}

module.exports = SonosNetwork;