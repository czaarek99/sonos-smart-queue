import { IAuthenticationService } from "../interfaces/services/AuthenticationService";
import { FETCH_JSON_HEADERS } from "../constants";
import { request } from "./Client";

enum LoginStatus {
    LOGGED_IN = "loggedIn",
    LOGGED_OUT = "loggedOut"
}

export class AuthenticationService implements IAuthenticationService {
    
    public async logIn(username: string, password: string) : Promise<void> {
        await request("/account/login", "POST", {
            username, password
        });
    }

    public async register(username: string, password: string) : Promise<void> {
        await request("/account", "PUT", {
            username, password
        })
    }

    public async isLoggedIn() : Promise<boolean> {
        const response = await request("/account/loginStatus", "GET");
        const text = await response.text()
        return text === LoginStatus.LOGGED_IN;
    }

}