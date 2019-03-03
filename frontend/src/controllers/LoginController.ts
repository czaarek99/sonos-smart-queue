import { ILoginController } from "../interfaces/controllers/LoginController";
import { observable } from "mobx";
import { LoginModel } from "../models/LoginModel";
import { ILoginModel } from "../interfaces/models/LoginModel";
import { IAuthenticationService } from "../interfaces/services/AuthenticationService";
import { IRootStore } from "../interfaces/stores/RootStore";
import { HttpError } from "../services/Client";
import { IAppController } from "../interfaces/controllers/AppController";

export class LoginController implements ILoginController {

    private readonly authenticationService: IAuthenticationService;
    private readonly appController: IAppController;
    @observable public error = "";
    @observable public model = new LoginModel();
    @observable public loading = false;

    constructor(rootStore: IRootStore, appController: IAppController) {
        this.authenticationService = rootStore.services.authenticationService;
        this.appController = appController;
    }

    public onChange(key: keyof ILoginModel, value: string) {
        this.model[key] = value;
    }

    private setLoggedIn() {
        this.appController.login();
    }

    public async onLogin() {
        this.loading = true;

        try {
            await this.authenticationService.logIn(this.model.username, this.model.password);
            this.setLoggedIn();
        } catch(error) {
            this.error = error.body.message;
        }

        this.loading = false;
    }

    public async onRegister() {
        this.loading = true;

        try {
            await this.authenticationService.register(this.model.username, this.model.password);
            this.setLoggedIn();
        } catch(error) {
            this.error = error.body.message;
        }

        this.loading = false;
    }
}