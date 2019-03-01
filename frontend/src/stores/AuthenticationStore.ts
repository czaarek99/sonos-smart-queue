import { AbstractStore } from "./AbstractStore";

import { KeyStore } from "../storage/KeyStore";
import { IAuthenticationStore } from "../interfaces/stores/AuthenticationStore";

interface IAuthInfo {
    loggedIn: boolean
}

export class AuthenticationStore extends AbstractStore implements IAuthenticationStore {

    private readonly clientSession = new KeyStore<IAuthInfo>(sessionStorage, "auth");

    public isLoggedIn() : boolean {
        const value = this.clientSession.getKeyValue("loggedIn");
        return value === null ? false : value === "true";
    }

    public setLoggedIn(isLoggedIn: boolean) : void {
        this.clientSession.setKeyValue("loggedIn", isLoggedIn.toString())
    }
}