import { IQueueService, IQueuedSong, QueueItemType, QueueCallback, IQueuedSongsMap } from "../interfaces/services/QueueService";
import { BaseService } from "./BaseService";

export class QueueService extends BaseService implements IQueueService {

	private readonly queueEvents: EventSource;
	private queueCallback: QueueCallback;
	private readonly queuedSongs: IQueuedSongsMap = {};

	constructor(accessToken: string, headers?: object) {
		super(accessToken, headers);

		const params = new URLSearchParams();
		params.set("authorization", accessToken);

		const eventUrl = "/queue/list?" + params.toString();
		console.log(eventUrl);
		this.queueEvents = new EventSource(eventUrl);

		this.queueEvents.onmessage = () => {
			console.log("message");
		}

		this.queueEvents.addEventListener("updateQueue", (event: MessageEvent) => {
			console.log(event.data);
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