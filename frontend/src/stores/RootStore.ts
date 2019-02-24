import { IRootStore, IServices } from "../interfaces/stores/RootStore";
import { AuthenticationStore } from "./AuthenticationStore";
import { IAuthenticationStore } from "../interfaces/stores/AuthenticationStore";
import { AuthenticationService } from "../services/AuthenticationService";
import { QueueService } from "../services/QueueService";
import { InfoService } from "../services/InfoService";
import { SpotifyService } from "../services/SpotifyService";

export class RootStore implements IRootStore {
    public readonly authenticationStore : IAuthenticationStore = new AuthenticationStore(this);
    public readonly services : IServices = {
        authenticationService: new AuthenticationService(),
        queueService: new QueueService(),
        infoService: new InfoService(),
        spotifyService: new SpotifyService()
    } 
}