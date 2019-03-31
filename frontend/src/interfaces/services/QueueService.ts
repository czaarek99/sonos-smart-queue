import { ISong } from "../Song";

export enum QueueItemType {
	SONG = "song",
	PLAYLIST = "playlist",
	ALBUM = "album",
	ARTIST = "artist"
} 

export interface IQueueService {
	addToQueue: (spotifyToken: string, groupId: string, id: string, type: QueueItemType) => Promise<void>
}