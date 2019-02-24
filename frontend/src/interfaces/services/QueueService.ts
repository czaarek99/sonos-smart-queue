export interface IQueuedSong {
    name: string,
    albumArtUrl: string,
    artistName: string
}

export interface IQueueService {
    getQueue: (groupId: string) => Promise<IQueuedSong[]>
}