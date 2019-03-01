import { IQueueService, IQueuedSong } from "../interfaces/services/QueueService";
import { FETCH_JSON_HEADERS } from "../constants";
import { request } from "./Client";

export class QueueService implements IQueueService {

    public async getQueue(groupId: string) : Promise<IQueuedSong[]> {
        const response = await request("/queue/list/" + groupId, "GET");
        return await response.json();
    }

}