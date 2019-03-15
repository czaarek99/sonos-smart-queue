import { ILoginController } from "../interfaces/controllers/LoginController";
import { observable } from "mobx";
import { LoginModel } from "../models/LoginModel";
import { ILoginModel } from "../interfaces/models/LoginModel";
import { IAuthenticationService } from "../interfaces/services/AuthenticationService";
import { AppController } from "./AppController";

export class LoginController implements ILoginController {

	private readonly appController: AppController;
	@observable public error = "";
	@observable public model = new LoginModel();
	@observable public loading = false;

	constructor(appController: AppController) {
		this.appController = appController;
	}

	public onChange(key: keyof ILoginModel, value: string) {
		this.model[key] = value;
	}

	public async onLogin() {
		this.loading = true;

		try {
			const token = await this.appController.getServices()
				.authenticationService.logIn(this.model.username, this.model.password);
			this.appController.setAccessToken(token)
		} catch(error) {
			this.error = error.body.message;
		}

		this.loading = false;
	}

	public async onRegister() {
		this.loading = true;

		try {
			const token = await this.appController.getServices()
				.authenticationService.register(this.model.username, this.model.password);
			this.appController.setAccessToken(token);
		} catch(error) {
			console.error(error);
			this.error = error.body.message;
		}

		this.loading = false;
	}
}