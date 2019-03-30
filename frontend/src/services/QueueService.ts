import { IQueueService, QueueItemType, QueueCallback } from "../interfaces/services/QueueService";
import { BaseService } from "./BaseService";

export class QueueService extends BaseService implements IQueueService {

	public setQueueUpdateCallback(groupId: string, callback: QueueCallback) : void {
		const eventUrl = `http://localhost:5000/queue/list/${groupId}`;
		this.destroyEventSource(eventUrl);

		this.setUpdateCallbacks(eventUrl, {
			eventName: "updateQueue",
			callback
		});
	}

	public async addToQueue(spotifyToken: string, groupId: string, id: string, type: QueueItemType) : Promise<void> {
		await this.client.put("/queue/add/" + groupId, {
			id,
			type
		}, {
			SpotifyToken: spotifyToken
		});
	}

}