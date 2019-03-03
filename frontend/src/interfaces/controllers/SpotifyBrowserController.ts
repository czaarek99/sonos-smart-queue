export enum BrowserState {
    NOT_LINKED,
    LINKING,
    LINKED
}

export interface ISpotifyBrowserController {
    readonly state: BrowserState
    readonly loading: boolean
    readonly searchQuery: string
    onLink: () => Promise<void>
    onSearch: (query: string) => Promise<void>
}