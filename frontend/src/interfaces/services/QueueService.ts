import { ISong } from "../Song";

export enum QueueItemType {
	SONG = "song",
	PLAYLIST = "playlist",
	ALBUM = "album",
	ARTIST = "artist"
} 

export type QueueCallback = (songs: ISong[]) => void

export interface IQueueService {
	setQueueUpdateCallback: (groupId: string, callback: QueueCallback) => void
	addToQueue: (spotifyToken: string, groupId: string, id: string, type: QueueItemType) => Promise<void>
}