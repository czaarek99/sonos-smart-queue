import { ISpotifyBrowserController, BrowserState } from "../interfaces/controllers/SpotifyBrowserController";
import { observable } from "mobx";
import { IRootStore } from "../interfaces/stores/RootStore";
import { IAccessToken } from "../interfaces/services/SpotifyService";

export class SpotifyBrowserController implements ISpotifyBrowserController {

    @observable private readonly rootStore: IRootStore;
    @observable public state = BrowserState.NOT_LINKED;
    @observable public loading = true;
    private accessToken: IAccessToken = null;

    constructor(rootStore: IRootStore) {
        this.rootStore = rootStore;
        this.load();
    }

    private async load() {
        try {
            this.accessToken = await this.rootStore.services.spotifyService.getAccessToken();
            this.state = BrowserState.LINKED;
        } catch(error) {
            this.state = BrowserState.NOT_LINKED;
        }

        this.loading = false;
    }

    public async onLink() : Promise<void> {
        const url = await this.rootStore.services.spotifyService.getSpotifyAuthUrl();
        this.state = BrowserState.LINKING;

        window.open(url);
    }

}