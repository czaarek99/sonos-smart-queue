import { IAuthenticationService } from "../interfaces/services/AuthenticationService";
import { FETCH_JSON_HEADERS } from "../constants";
import { request } from "./Client";

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

}