import { BaseService } from "./BaseService";
import { IControlService, PlayingCallback } from "../interfaces/services/ControlService";

export class ControlService extends BaseService implements IControlService {

	setPlayingUpdateCallback(groupId: string, callback: PlayingCallback) {
		const eventUrl = `http://localhost:5000/control/playing/${groupId}`;
		this.destroyEventSource(eventUrl);

		this.setUpdateCallbacks(eventUrl, {
			eventName: "updatePlaying",
			callback
		});
	}

}