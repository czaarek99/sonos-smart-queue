export interface IAuthResponse {
    success: boolean,
    error: string
}

type AuthFunction = (username: string, password: string) => Promise<IAuthResponse>

export interface IAuthenticationService {
    logIn: AuthFunction
    register: AuthFunction
}