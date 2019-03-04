import { IAuthenticationService, AccessToken } from "../interfaces/services/AuthenticationService";
import { BaseService } from "./BaseService";

enum LoginStatus {
    LOGGED_IN = "loggedIn",
    LOGGED_OUT = "loggedOut"
}

export class AuthenticationService extends BaseService implements IAuthenticationService {
    
    public async logIn(username: string, password: string) : Promise<AccessToken> {
        const response = await this.client.post("/account/login", {
            username, password
        });

        return await response.text();
    }

    public async register(username: string, password: string) : Promise<AccessToken> {
        const response = await this.client.put("/account", {
            username, password
        });

        return await response.text();
    }

    public async verifyToken() : Promise<void> {
        await this.client.get("/account/tokenStatus");
    }
}