import { ISpotifySearchResponse } from "../services/SpotifyService";
import { QueueItemType } from "../services/QueueService";

export enum BrowserState {
    NOT_LINKED,
    LINKING,
    LINKED
}

export enum SearchPage {
    SONGS = 0,
    PLAYLISTS = 1,
    ARTISTS = 2,
    ALBUMS = 3
}

export interface ISpotifyBrowserController {
    readonly state: BrowserState
    readonly loading: boolean
    readonly searching: boolean
    readonly searchQuery: string
    readonly searchResult: ISpotifySearchResponse;
    readonly selectedNavigation: number

    onQueue: (id: string, type: QueueItemType) => Promise<void>
    onNavigation: (navigation: number) => void
    onLink: () => Promise<void>
    onSearch: (query: string) => Promise<void>
}