const {DeviceDiscovery, Sonos} = require("sonos");

class SonosError extends Error {
}

async function getMainDevice() {
	return new Promise((resolve, reject) => {
		DeviceDiscovery().once("DeviceAvailable", (device) => {
			resolve(device);
		});
	})
}

function getZoneMemberIP(zoneMember) {
	return zoneMember.Location.replace("http://", "").replace(":1400/xml/device_description.xml", "");
}

async function getGroupedClients() {
	const mainDevice = await getMainDevice();
	const groups = await mainDevice.getAllGroups();
	const groupedDevices = new Map();

	for (const group of groups) {

		const speakers = [];
		let coordinatorUrl = null;

		if(Array.isArray(group.ZoneGroupMember)) {
			for (const zoneMember of group.ZoneGroupMember) {
				speakers.push({
					name: zoneMember.ZoneName,
					id: zoneMember.UUID
				});

				if (zoneMember.UUID === group.Coordinator) {
					coordinatorUrl = getZoneMemberIP(zoneMember);
					break;
				}
			}
		} else {
			const member = group.ZoneGroupMember;
			coordinatorUrl = getZoneMemberIP(member);

			speakers.push({
				name: member.ZoneName,
				id: member.UUID
			});
		}

		if (coordinatorUrl === null) {
			throw new Error("Could not find coordinator in zone members")
		} else {
			groupedDevices.set(group.ID, {
				speakers,
				coordinatorUrl
			})
		}
	}
	return groupedDevices;
}

async function getClientByGroupId(groupId) {
	const clients = await getGroupedClients();
	const client = clients.get(groupId);
	if (client === undefined) {
		throw new SonosError("No such group")
	}
	return client;
}

async function getSonosByGroupId(groupId) {
	const client = await getClientByGroupId(groupId);
	return new Sonos(client.coordinatorUrl);
}

module.exports = {
	getMainDevice,
	getGroupedClients,
	getClientByGroupId,
	getClientByGroupId,
	getSonosByGroupId,
	SonosError
}
