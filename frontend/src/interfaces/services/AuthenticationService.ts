export type AccessToken = string

type AuthFunction = (username: string, password: string) => Promise<AccessToken>

export interface IAuthenticationService {
	logIn: AuthFunction
	register: AuthFunction
	verifyToken: () => Promise<void>
}