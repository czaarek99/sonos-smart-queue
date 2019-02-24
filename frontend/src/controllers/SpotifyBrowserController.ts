import { ISpotifyBrowserController, BrowserState } from "../interfaces/controllers/SpotifyBrowserController";
import { observable } from "mobx";
import { IRootStore } from "../interfaces/stores/RootStore";

export class SpotifyBrowserController implements ISpotifyBrowserController {

    private readonly rootStore: IRootStore;
    @observable public state = BrowserState.NOT_LINKED;
    @observable public loading = true;

    constructor(rootStore: IRootStore) {
        this.rootStore = rootStore;

        this.load();
    }

    private async load() {
        const hasLink = await this.rootStore.services.spotifyService.hasSpotifyLink();

        if(hasLink) {
            this.state = BrowserState.LINKED;
        }

        this.loading = false;
    }

    public async onLink() : Promise<void> {
        const url = await this.rootStore.services.spotifyService.getSpotifyAuthUrl();
        this.state = BrowserState.LINKING;

        window.open(url);
    }

}