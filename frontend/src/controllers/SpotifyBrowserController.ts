import { ISpotifyBrowserController, BrowserState, SearchPage } from "../interfaces/controllers/SpotifyBrowserController";
import { observable } from "mobx";
import { IAccessToken, ISpotifyService } from "../interfaces/services/SpotifyService";
import { KeyStore } from "../storage/KeyStore";
import { AppController } from "./AppController";
import { QueueItemType } from "../interfaces/services/QueueService";

interface IBrowserData {
	accessToken: string,
	accessTokenExpiration: string
}

const MIN_SEARCH_LENGTH = 2;
const SEARCH_DELAY = 400;

export class SpotifyBrowserController implements ISpotifyBrowserController {

	private readonly appController: AppController;
	private searchTimeout: number;
	@observable private readonly browserStorage = new KeyStore<IBrowserData>(sessionStorage, "browser");
	@observable public searchQuery = "";
	@observable public state = BrowserState.NOT_LINKED;
	@observable public loading = true;
	@observable public searchResult = null;
	@observable public searching = false;
	@observable public selectedNavigation = SearchPage.SONGS;

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
		try {
			await this.getAccessToken();
			this.state = BrowserState.LINKED;
		} catch(error) {

		}

		this.loading = false;
	}

	public onNavigation(navigation: number) {
		this.selectedNavigation = navigation;
	}

	public async onQueue(id: string, type: QueueItemType) {
		const token = await this.getAccessToken();
		//TODO: Make groupids work properly
		await this.appController.getServices()
			.queueService.addToQueue(
				token, this.appController.getGroupId(), id, type);
	}

	public async onSearch(query: string) : Promise<void> {
		this.searchQuery = query;

		clearTimeout(this.searchTimeout);
		if(!this.searching && query.length > MIN_SEARCH_LENGTH) {
			this.searchTimeout = window.setTimeout(async () => {
				this.searching = true;
				const token = await this.getAccessToken();
				this.searchResult = await this.spotifyService.search(query, token);
				this.searching = false;

				if(this.searchQuery !== query) {
					this.onSearch(this.searchQuery);
				}
			}, SEARCH_DELAY)
		}
	}

	public async onLink() : Promise<void> {
		const url = await this.spotifyService.getSpotifyAuthUrl();
		this.state = BrowserState.LINKING;
		window.location.replace(url)
	}

}