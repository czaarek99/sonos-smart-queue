import { IQueueService, IQueuedSong, QueueItemType } from "../interfaces/services/QueueService";
import { BaseService } from "./BaseService";

export class QueueService extends BaseService implements IQueueService {

	public async getQueue(groupId: string) : Promise<IQueuedSong[]> {
		const response = await this.client.get("/queue/list/" + groupId);
		return await response.json();
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