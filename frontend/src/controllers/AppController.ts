import { KeyStore } from "../storage/KeyStore";
import { observable, computed } from "mobx";
import { IAuthenticationService } from "../interfaces/services/AuthenticationService";
import { IQueueService } from "../interfaces/services/QueueService";
import { IInfoService, ISpeakerGroup } from "../interfaces/services/InfoService";
import { ISpotifyService } from "../interfaces/services/SpotifyService";
import { AuthenticationService } from "../services/AuthenticationService";
import { QueueService } from "../services/QueueService";
import { InfoService } from "../services/InfoService";
import { SpotifyService } from "../services/SpotifyService";
import { SmartQueueController } from "./SmartQueueController";
import { ISong } from "../interfaces/Song";
import { ControlService } from "../services/ControlService";
import { IControlService, IPlaying } from "../interfaces/services/ControlService";

interface IGlobalData {
	accessToken: string
}

export interface IServices {
	authenticationService: IAuthenticationService,
	queueService: IQueueService,
	infoService: IInfoService,
	spotifyService: ISpotifyService
	controlService: IControlService
}

export class AppController {

	private services: IServices;
	private accessToken: string;
	private firstGroup = true;
	@observable private groupId = null;
	@observable private queueItems: ISong[] = [];
	@observable private currentlyPlaying: ISong = null;
	@observable private speakerGroups: ISpeakerGroup[] = [];
	@observable private globalStorage = new KeyStore<IGlobalData>(localStorage, "global");
	@observable public loggedIn = false;

	constructor() {
		this.accessToken = this.globalStorage.getKeyValue("accessToken");
		if(this.accessToken) {
			this.setAccessToken(this.accessToken);
		} else {
			this.createServices();
		}

		this.load() ;
	}

	private createServices() : void {
		this.services = {
			authenticationService: new AuthenticationService(this.accessToken),
			queueService: new QueueService(this.accessToken),
			infoService: new InfoService(this.accessToken),
			spotifyService: new SpotifyService(this.accessToken),
			controlService: new ControlService(this.accessToken)
		}
	}

	public setAccessToken(token: string) {
		this.globalStorage.setKeyValue("accessToken", token);
		this.accessToken = token;
		this.createServices();

		this.loggedIn = true;
	}

	public getServices() : IServices {
		return {
			...this.services
		};
	}

	public getQueue() : ISong[] {
		return this.queueItems;
	}

	public getGroupId() : string {
		return this.groupId;
	}

	public getGroups() : ISpeakerGroup[] {
		return this.speakerGroups;
	}

	public getCurrentlyPlaying() {
		return this.currentlyPlaying;
	}

	public setGroupId(id: string) {
		this.groupId = id;

		this.services.controlService.setPlayingUpdateCallback(id, (playing: IPlaying) => {
			this.currentlyPlaying = playing.playing;
		});

		this.services.queueService.setQueueUpdateCallback(id, (songs: ISong[]) => {
			this.queueItems = songs;
		});
	}

	private async load() : Promise<void> {
		if(this.loggedIn) {
			try {
				await this.services.authenticationService.verifyToken();

				this.services.infoService.setGroupUpdateCallback((groups: ISpeakerGroup[]) => {
					if(this.firstGroup) {
						this.firstGroup = false;
						this.setGroupId(groups[0].id);
					}

					this.speakerGroups = groups;
				});
			} catch(error) {
				this.loggedIn = false;
			}
		}
	}

}