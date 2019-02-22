import { IRootStore, IServices } from "../interfaces/stores/RootStore";
import { AuthenticationStore } from "./AuthenticationStore";
import { IAuthenticationStore } from "../interfaces/stores/AuthenticationStore";
import { AuthenticationService } from "../services/AuthenticationService";

export class RootStore implements IRootStore {
    public readonly authenticationStore : IAuthenticationStore = new AuthenticationStore(this);
    public readonly services : IServices = {
        authenticationService: new AuthenticationService()
    } 
}