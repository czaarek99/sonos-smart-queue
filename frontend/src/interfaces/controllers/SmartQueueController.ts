import { IQueuedSong } from "../services/QueueService";

export interface ISmartQueueController {
    readonly queueItems: IQueuedSong[]
    readonly loading: boolean;
    groupId: string;
}