import { KeyStore } from "../storage/KeyStore";
import { observable, computed } from "mobx";
import { IAuthenticationService } from "../interfaces/services/AuthenticationService";
import { IQueueService } from "../interfaces/services/QueueService";
import { IInfoService } from "../interfaces/services/InfoService";
import { ISpotifyService } from "../interfaces/services/SpotifyService";
import { AuthenticationService } from "../services/AuthenticationService";
import { QueueService } from "../services/QueueService";
import { InfoService } from "../services/InfoService";
import { SpotifyService } from "../services/SpotifyService";

interface IGlobalData {
    accessToken: string
}

export interface IServices {
    authenticationService: IAuthenticationService,
    queueService: IQueueService,
    infoService: IInfoService,
    spotifyService: ISpotifyService
}

export class AppController {

    private services: IServices;
    private accessToken: string;
    @observable globalStorage = new KeyStore<IGlobalData>(localStorage, "global");
    @observable public loggedIn = false;

    constructor() {
        this.accessToken = this.globalStorage.getKeyValue("accessToken");
        if(this.accessToken) {
            this.setAccessToken(this.accessToken);
        } else {
            this.createServices();
        }

        this.load();
    }

    private createServices() : void {
        this.services = {
            authenticationService: new AuthenticationService(this.accessToken),
            queueService: new QueueService(this.accessToken),
            infoService: new InfoService(this.accessToken),
            spotifyService: new SpotifyService(this.accessToken)
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

    private async load() : Promise<void> {
        if(this.loggedIn) {
            try {
                await this.services.authenticationService.verifyToken();
            } catch(error) {
                this.loggedIn = false;
            }
        }
    }

}