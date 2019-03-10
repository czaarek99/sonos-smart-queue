import { IQueuedSong } from "../services/QueueService";
import { ISpeakerGroup } from "../services/InfoService";

export interface ISmartQueueController {
    readonly speakerGroups: ISpeakerGroup[]
    readonly queueItems: IQueuedSong[]
    readonly loading: boolean;
    readonly groupId: string;

    refreshQueue: () => Promise<void>
}