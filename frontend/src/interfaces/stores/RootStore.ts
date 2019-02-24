import { IAuthenticationStore } from "./AuthenticationStore";
import { IAuthenticationService } from "../services/AuthenticationService";
import { IQueueService } from "../services/QueueService";

export interface IServices {
    authenticationService: IAuthenticationService,
    queueService: IQueueService
}

export interface IRootStore {
    readonly authenticationStore: IAuthenticationStore
    readonly services: IServices
}