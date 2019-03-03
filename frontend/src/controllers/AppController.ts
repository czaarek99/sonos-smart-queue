import { IAppController } from "../interfaces/controllers/AppController";
import { KeyStore } from "../storage/KeyStore";
import { observable, computed } from "mobx";
import { IAuthenticationService } from "../interfaces/services/AuthenticationService";
import { IRootStore } from "../interfaces/stores/RootStore";

export class AppController implements IAppController {

    private readonly rootStore: IRootStore;
    @observable public loggedIn = false;

    constructor(rootStore: IRootStore) {
        this.rootStore = rootStore;
        this.load();
    }

    public login() : void {
        this.loggedIn = true;
    }

    private async load() : Promise<void> {
        this.loggedIn = await this.rootStore.services.authenticationService.isLoggedIn()
    }

}