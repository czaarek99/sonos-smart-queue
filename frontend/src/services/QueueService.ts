import { IQueueService, IQueuedSong } from "../interfaces/services/QueueService";
import { BaseService } from "./BaseService";

export class QueueService extends BaseService implements IQueueService {

    public async getQueue(groupId: string) : Promise<IQueuedSong[]> {
        const response = await this.client.get("/queue/list/" + groupId);
        return await response.json();
    }

}