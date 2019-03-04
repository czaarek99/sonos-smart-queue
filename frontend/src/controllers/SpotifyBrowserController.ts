import { ISpotifyBrowserController, BrowserState } from "../interfaces/controllers/SpotifyBrowserController";
import { observable } from "mobx";
import { IAccessToken, ISpotifyService } from "../interfaces/services/SpotifyService";
import { KeyStore } from "../storage/KeyStore";
import { AppController } from "./AppController";

interface IBrowserData {
    accessToken: string,
    accessTokenExpiration: string
}

export class SpotifyBrowserController implements ISpotifyBrowserController {

    private readonly appController: AppController;
    @observable private readonly browserStorage = new KeyStore<IBrowserData>(sessionStorage, "browser");
    @observable public searchQuery = "";
    @observable public state = BrowserState.NOT_LINKED;
    @observable public loading = true;

    constructor(appController: AppController) {
        this.appController = appController;
        this.load();
    }

    private get spotifyService() : ISpotifyService {
        return this.appController.getServices().spotifyService;
    }

    private async getAccessToken() : Promise<string> {

        const requestToken = async () => {
            const response = await this.spotifyService.getAccessToken();
            const expirationDate = new Date();
            expirationDate.setSeconds(expirationDate.getSeconds() +  response.expiresIn);

            this.browserStorage.setKeyValue("accessToken", response.token);
            this.browserStorage.setKeyValue("accessTokenExpiration", expirationDate.getTime().toString());
            return response.token;
        }

        const accessToken = this.browserStorage.getKeyValue("accessToken");
        if(accessToken === null) {
            return await requestToken();
        }

        const expirationTimestamp = this.browserStorage.getKeyValue("accessTokenExpiration");
        if(expirationTimestamp !== null) {
            const expirationDate = new Date(parseInt(expirationTimestamp));
            const now = new Date();

            if(now > expirationDate) {
                return await requestToken();
            }
        }

        return this.browserStorage.getKeyValue("accessToken");
    }

    private async load() {
        this.loading = true;

        try {
            await this.getAccessToken();
            this.state = BrowserState.LINKED;
        } catch(error) {

        }

        this.loading = false;
    }

    public async onSearch(query: string) : Promise<void> {
        this.searchQuery = query;

        if(query.length > 4) {
            const token = await this.getAccessToken();
            const response = await this.spotifyService.search(query, token);
            console.log(response);
        }
    }

    public async onLink() : Promise<void> {
        const url = await this.spotifyService.getSpotifyAuthUrl();
        this.state = BrowserState.LINKING;
        window.location.replace(url)
    }

}