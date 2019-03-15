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

		if(typeof group.ZoneGroupMember === "object") {
			const member = group.ZoneGroupMember;
			coordinatorUrl = getZoneMemberIP(member);

			speakers.push({
				name: member.ZoneName,
				id: member.UUID
			});
		} else if(Array.isArray(group.ZoneGroupMember)) {
			const members = group.ZoneGroupMember;

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
const temp = ` [ { Coordinator: 'RINCON_949F3E536A4201400', ID: 'RINCON_949F3E536A4201400:2850765332', ZoneGroupMember: [ { UUID: 'RINCON_949F3E536A4201400', Location: 'http://172.16.10.26:1400/xml/device_description.xml', ZoneName: 'Utveckling 5', Icon: 'x-rincon-roomicon:office', Configuration: '1', SoftwareVersion: '47.2-59120', MinCompatibleVersion: '46.0-00000', LegacyCompatibleVersion: '36.0-00000', ChannelMapSet: 'RINCON_949F3E536A4201400:LF,RF;RINCON_949F3E326EB401400:SW,SW', BootSeq: '75', TVConfigurationError: '0', HdmiCecAvailable: '0', WirelessMode: '0', WirelessLeafOnly: '0', HasConfiguredSSID: '1', ChannelFreq: '2412', BehindWifiExtender: '0', WifiEnabled: '1', Orientation: '0', RoomCalibrationState: '4', SecureRegState: '3', VoiceState: '0', AirPlayEnabled: '1', IdleState: '0' }, { UUID: 'RINCON_949F3EC48FEA01400', Location: 'http://172.16.10.24:1400/xml/device_description.xml', ZoneName: 'Chillout', Icon: 'x-rincon-roomicon:living', Configuration: '1', SoftwareVersion: '47.2-59120', MinCompatibleVersion: '46.0-00000', LegacyCompatibleVersion: '36.0-00000', BootSeq: '3', TVConfigurationError: '1', HdmiCecAvailable: '1', WirelessMode: '0', WirelessLeafOnly: '0', HasConfiguredSSID: '1', ChannelFreq: '2412', BehindWifiExtender: '0', WifiEnabled: '1', Orientation: '0', RoomCalibrationState: '4', SecureRegState: '3', VoiceState: '0', AirPlayEnabled: '1', IdleState: '0' }, { UUID: 'RINCON_949F3EE21CC201400', Location: 'http://172.16.10.21:1400/xml/device_description.xml', ZoneName: 'Utveckling 3H', Icon: 'x-rincon-roomicon:living', Configuration: '1', SoftwareVersion: '47.2-59120', MinCompatibleVersion: '46.0-00000', LegacyCompatibleVersion: '36.0-00000', BootSeq: '66', TVConfigurationError: '0', HdmiCecAvailable: '0', WirelessMode: '0', WirelessLeafOnly: '0', HasConfiguredSSID: '1', ChannelFreq: '2412', BehindWifiExtender: '0', WifiEnabled: '1', Orientation: '0', RoomCalibrationState: '4', SecureRegState: '3', VoiceState: '0', AirPlayEnabled: '0', IdleState: '0' }, { UUID: 'RINCON_949F3E326EB401400', Location: 'http://172.16.10.22:1400/xml/device_description.xml', ZoneName: 'Utveckling 5', Icon: 'x-rincon-roomicon:office', Configuration: '1', Invisible: '1', SoftwareVersion: '47.2-59120', MinCompatibleVersion: '46.0-00000', LegacyCompatibleVersion: '36.0-00000', ChannelMapSet: 'RINCON_949F3E536A4201400:LF,RF;RINCON_949F3E326EB401400:SW,SW', BootSeq: '52', TVConfigurationError: '0', HdmiCecAvailable: '0', WirelessMode: '0', WirelessLeafOnly: '0', HasConfiguredSSID: '1', ChannelFreq: '2412', BehindWifiExtender: '0', WifiEnabled: '1', Orientation: '0', RoomCalibrationState: '4', SecureRegState: '3', VoiceState: '0', AirPlayEnabled: '0', IdleState: '0' }, { UUID: 'RINCON_7828CAB3738C01400', Location: 'http://172.16.10.27:1400/xml/device_description.xml', ZoneName: 'Biljardhallen', Icon: 'x-rincon-roomicon:living', Configuration: '1', SoftwareVersion: '47.2-59120', MinCompatibleVersion: '46.0-00000', LegacyCompatibleVersion: '36.0-00000', BootSeq: '3', TVConfigurationError: '0', HdmiCecAvailable: '0', WirelessMode: '0', WirelessLeafOnly: '0', HasConfiguredSSID: '1', ChannelFreq: '2412', BehindWifiExtender: '0', WifiEnabled: '1', Orientation: '0', RoomCalibrationState: '4', SecureRegState: '3', VoiceState: '0', AirPlayEnabled: '1', IdleState: '0' }, { UUID: 'RINCON_949F3EE2BAEA01400', Location: 'http://172.16.10.23:1400/xml/device_description.xml', ZoneName: 'Utveckling 3V', Icon: 'x-rincon-roomicon:living', Configuration: '1', SoftwareVersion: '47.2-59120', MinCompatibleVersion: '46.0-00000', LegacyCompatibleVersion: '36.0-00000', BootSeq: '60', TVConfigurationError: '0', HdmiCecAvailable: '0', WirelessMode: '0', WirelessLeafOnly: '0', HasConfiguredSSID: '1', ChannelFreq: '2412', BehindWifiExtender: '0', WifiEnabled: '1', Orientation: '0', RoomCalibrationState: '4', SecureRegState: '3', VoiceState: '0', AirPlayEnabled: '0', IdleState: '0' } ] }, { Coordinator: 'RINCON_7828CAB3716201400', ID: 'RINCON_7828CAB3716201400:1979380587', ZoneGroupMember: [ { UUID: 'RINCON_7828CAB3716201400', Location: 'http://172.16.10.41:1400/xml/device_description.xml', ZoneName: 'Pannrummet', Icon: 'x-rincon-roomicon:living', Configuration: '1', SoftwareVersion: '47.2-59120', MinCompatibleVersion: '46.0-00000', LegacyCompatibleVersion: '36.0-00000', BootSeq: '3', TVConfigurationError: '0', HdmiCecAvailable: '0', WirelessMode: '0', WirelessLeafOnly: '0', HasConfiguredSSID: '1', ChannelFreq: '2412', BehindWifiExtender: '0', WifiEnabled: '1', Orientation: '0', RoomCalibrationState: '4', SecureRegState: '3', VoiceState: '0', AirPlayEnabled: '1', IdleState: '1' } ] }, { Coordinator: 'RINCON_7828CA70627E01400', ID: 'RINCON_7828CA70627E01400:1134245848', ZoneGroupMember: [ { UUID: 'RINCON_7828CA70627E01400', Location: 'http://172.16.10.20:1400/xml/device_description.xml', ZoneName: 'BOOST', Icon: 'x-rincon-roomicon:viper', Configuration: '1', Invisible: '1', IsZoneBridge: '1', SoftwareVersion: '47.2-59120', MinCompatibleVersion: '46.0-00000', LegacyCompatibleVersion: '36.0-00000', BootSeq: '27', TVConfigurationError: '0', HdmiCecAvailable: '0', WirelessMode: '0', WirelessLeafOnly: '0', HasConfiguredSSID: '1', ChannelFreq: '2412', BehindWifiExtender: '0', WifiEnabled: '1', Orientation: '-1', RoomCalibrationState: '0', SecureRegState: '3', VoiceState: '0', AirPlayEnabled: '0', IdleState: '1' } ] } ]`;
