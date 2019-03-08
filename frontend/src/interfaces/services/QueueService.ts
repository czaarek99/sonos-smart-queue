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

export interface IQueueService {
    getQueue: (groupId: string) => Promise<IQueuedSong[]>
    addToQueue: (spotifyToken: string, groupId: string, id: string, type: QueueItemType) => Promise<void>
}