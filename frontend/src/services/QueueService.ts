import { IQueueService, IQueuedSong, QueueItemType, QueueCallback, IQueuedSongsMap } from "../interfaces/services/QueueService";
import { BaseService } from "./BaseService";

export class QueueService extends BaseService implements IQueueService {

	private readonly queueEvents: EventSource;
	private queueCallback: QueueCallback;

	constructor(accessToken: string, headers?: object) {
		super(accessToken, headers);

		const params = new URLSearchParams();
		params.set("authorization", accessToken);

		const eventUrl = "http://localhost:5000/queue/list?" + params.toString();
		this.queueEvents = new EventSource(eventUrl);

		this.queueEvents.addEventListener("updateQueue", (event: MessageEvent) => {
			this.queueCallback(JSON.parse(event.data));
		})
	}

	addQueueCallbackService(callback: QueueCallback) {
		this.queueCallback = callback;
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