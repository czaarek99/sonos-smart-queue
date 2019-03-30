export interface IQueuedSong {
	name: string,
	albumArtUrl: string,
	artistName: string
}

export enum QueueItemType {
	SONG = "song",
	PLAYLIST = "playlist",
	ALBUM = "album",
	ARTIST = "artist"
} 

export interface IQueuedSongsMap {
	[key: string]: IQueuedSong[]
}

export type QueueCallback = (songMap: IQueuedSongsMap) => void

export interface IQueueService {
	addQueueCallbackService: (callback: QueueCallback) => void
	addToQueue: (spotifyToken: string, groupId: string, id: string, type: QueueItemType) => Promise<void>
}