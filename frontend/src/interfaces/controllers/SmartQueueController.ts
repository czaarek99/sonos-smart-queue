import { ISpeakerGroup } from "../services/InfoService";
import { ISong } from "../Song";

export interface ISmartQueueController {
	readonly queueItems: ISong[]
	readonly loading: boolean;
	readonly groupId: string;
}