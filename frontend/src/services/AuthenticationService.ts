import { IAuthenticationService, IAuthResponse } from "../interfaces/services/AuthenticationService";
import { FETCH_JSON_HEADERS } from "../constants";

export class AuthenticationService implements IAuthenticationService {

    private async respond(response: Response) : Promise<IAuthResponse> {

        //TODO: Make this detect between an execpted an unexpected error
        if(response.ok) {
            return {
                success: true,
                error: ""
            }
        } else {
            const json = await response.json();
            return {
                success: false,
                error: json.message
            }
        }
    }

    public async logIn(username: string, password: string) : Promise<IAuthResponse> {
        const response = await fetch("/account/login", {
            method: "POST",
            body: JSON.stringify({
                username, password
            }),
            headers: FETCH_JSON_HEADERS
        });

        return await this.respond(response);
    }

    public async register(username: string, password: string) : Promise<IAuthResponse> {
        const response = await fetch("/account", {
            method: "PUT",
            body: JSON.stringify({
                username, password
            }),
            headers: FETCH_JSON_HEADERS
        });

        return await this.respond(response);
    }

}