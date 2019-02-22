export interface IAuthenticationStore {
    isLoggedIn: () => boolean
    setLoggedIn: (loggedIn: boolean) => void
}