import { ILoginController } from "../interfaces/controllers/LoginController";
import { observable } from "mobx";
import { LoginModel } from "../models/LoginModel";
import { ILoginModel } from "../interfaces/models/LoginModel";
import { IAuthenticationService } from "../interfaces/services/AuthenticationService";
import { IAuthenticationStore } from "../interfaces/stores/AuthenticationStore";
import { IRootStore } from "../interfaces/stores/RootStore";
import { HttpError } from "../services/Client";

export class LoginController implements ILoginController {

    private readonly rootStore: IRootStore;
    private readonly authenticationService: IAuthenticationService;
    @observable public error = "";
    @observable public model = new LoginModel();
    @observable public loading = false;

    constructor(rootStore: IRootStore) {
        this.rootStore = rootStore;
        this.authenticationService = rootStore.services.authenticationService;
    }

    public onChange(key: keyof ILoginModel, value: string) {
        this.model[key] = value;
    }

    private setLoggedIn() {
        this.rootStore.authenticationStore.setLoggedIn(true);
    }

    public async onLogin() {
        this.loading = true;

        try {
            await this.authenticationService.logIn(this.model.username, this.model.password);
            this.setLoggedIn();
        } catch(error) {
            this.error = error.message;
        }

        this.loading = false;
    }

    public async onRegister() {
        this.loading = true;

        try {
            await this.authenticationService.register(this.model.username, this.model.password);
            this.setLoggedIn();
        } catch(error) {
            this.error = error.message;
        }
    }
}