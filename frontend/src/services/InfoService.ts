import { IInfoService, ISpeakerGroup, SpeakersCallback } from "../interfaces/services/InfoService";
import { BaseService } from "./BaseService";

export class InfoService extends BaseService implements IInfoService {

	public setGroupUpdateCallback(callback: SpeakersCallback) : void {
		const eventUrl = `http://localhost:5000/info/groups`;
		this.destroyEventSource(eventUrl);

		this.setUpdateCallbacks(eventUrl, {
			eventName: "groupUpdate",
			callback
		})
	}

}