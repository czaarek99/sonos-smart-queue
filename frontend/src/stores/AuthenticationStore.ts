import { AbstractStore } from "./AbstractStore";

import { KeyStore } from "../storage/KeyStore";
import { IAuthenticationStore } from "../interfaces/stores/AuthenticationStore";

const LOGGED_IN_KEY = "loggedIn";

interface IAuthStorage {
    isLoggedIn: boolean
}

export class AuthenticationStore extends AbstractStore implements IAuthenticationStore {

    private readonly localStore = new KeyStore("auth");

    public isLoggedIn() : boolean {
        const value = this.localStore.getKeyValue<IAuthStorage>(LOGGED_IN_KEY)
        if(value === null) {
            return false;
        }

        return value.isLoggedIn;
    }

    public setLoggedIn(isLoggedIn: boolean) : void {
        this.localStore.setKeyValue(LOGGED_IN_KEY, {
            isLoggedIn
        })
    }
}