type AuthFunction = (username: string, password: string) => Promise<void>

export interface IAuthenticationService {
    logIn: AuthFunction
    register: AuthFunction
}