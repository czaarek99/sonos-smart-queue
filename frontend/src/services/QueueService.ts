import { IQueueService, IQueuedSong } from "../interfaces/services/QueueService";
import { FETCH_JSON_HEADERS } from "../constants";

export class QueueService implements IQueueService {

    public async getQueue(groupId: string) : Promise<IQueuedSong[]> {
        const response = await fetch("/queue/list/" + groupId, {
            method: "GET",
            headers: FETCH_JSON_HEADERS
        });

        return await response.json();
    }

}