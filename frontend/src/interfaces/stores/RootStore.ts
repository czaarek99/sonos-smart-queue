import { IAuthenticationService } from "../services/AuthenticationService";
import { IQueueService } from "../services/QueueService";
import { IInfoService } from "../services/InfoService";
import { ISpotifyService } from "../services/SpotifyService";

export interface IServices {
    authenticationService: IAuthenticationService,
    queueService: IQueueService,
    infoService: IInfoService,
    spotifyService: ISpotifyService
}

export interface IRootStore {
    readonly services: IServices
}