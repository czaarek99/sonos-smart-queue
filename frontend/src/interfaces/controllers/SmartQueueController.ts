import { IQueuedSong } from "../services/QueueService";
import { ISpeakerGroup } from "../services/InfoService";

export interface ISmartQueueController {
	readonly queueItems: IQueuedSong[]
	readonly loading: boolean;
	readonly groupId: string;

	refreshQueue: () => Promise<void>
}