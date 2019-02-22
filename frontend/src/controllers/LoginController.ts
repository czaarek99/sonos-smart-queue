import { ILoginController } from "../interfaces/controllers/LoginController";
import { observable } from "mobx";
import { LoginModel } from "../models/LoginModel";
import { ILoginModel } from "../interfaces/models/LoginModel";
import { IAuthenticationService } from "../interfaces/services/AuthenticationService";
import { IAuthenticationStore } from "../interfaces/stores/AuthenticationStore";
import { IRootStore } from "../interfaces/stores/RootStore";

export class LoginController implements ILoginController {

    private readonly rootStore: IRootStore;
    private readonly authenticationService: IAuthenticationService;
    @observable public error : string = "";
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

        const response = await this.authenticationService.logIn(this.model.username, this.model.password);

        if(response.success) {
            this.setLoggedIn();
        } else {
            this.error = response.error;
        }

        this.loading = false;
    }

    public async onRegister() {
        this.loading = true;

        const response = await this.authenticationService.register(this.model.username, this.model.password);

        if(response.success) {
            this.setLoggedIn();
        } else {
            this.error = response.error;
        }

        this.loading = false;
    }
}