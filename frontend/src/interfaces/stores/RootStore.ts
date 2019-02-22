import { IAuthenticationStore } from "./AuthenticationStore";
import { IAuthenticationService } from "../services/AuthenticationService";

export interface IServices {
    authenticationService: IAuthenticationService
}

export interface IRootStore {
    readonly authenticationStore: IAuthenticationStore
    readonly services: IServices
}