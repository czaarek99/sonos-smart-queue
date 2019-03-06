import { ISpotifySearchResponse } from "../services/SpotifyService";

export enum BrowserState {
    NOT_LINKED,
    LINKING,
    LINKED
}

export interface ISpotifyBrowserController {
    readonly state: BrowserState
    readonly loading: boolean
    readonly searching: boolean
    readonly searchQuery: string
    readonly searchResult: ISpotifySearchResponse;
    readonly selectedNavigation: number

    onNavigation: (navigation: number) => void
    onLink: () => Promise<void>
    onSearch: (query: string) => Promise<void>
}