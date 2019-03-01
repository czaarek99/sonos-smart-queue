export interface IAccessToken {
    token: string,
    expiresIn: number
}

export interface ISpotifyService {
    getAccessToken: () => Promise<IAccessToken>
    getSpotifyAuthUrl: () => Promise<string>
}