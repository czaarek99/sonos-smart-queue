export enum BrowserState {
    NOT_LINKED,
    LINKING,
    LINKED
}

export interface ISpotifyBrowserController {
    readonly state: BrowserState;
    readonly loading: boolean;
    onLink: () => Promise<void>
}