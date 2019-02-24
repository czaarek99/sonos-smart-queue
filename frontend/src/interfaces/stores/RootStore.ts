import { IAuthenticationStore } from "./AuthenticationStore";
import { IAuthenticationService } from "../services/AuthenticationService";
import { IQueueService } from "../services/QueueService";
import { IInfoService } from "../services/InfoService";

export interface IServices {
    authenticationService: IAuthenticationService,
    queueService: IQueueService,
    infoService: IInfoService
}

export interface IRootStore {
    readonly authenticationStore: IAuthenticationStore
    readonly services: IServices
}