export interface IAccessToken {
    token: string,
    expiresIn: number
}

interface ISearchResponse {
}

export interface ISpotifyService {
    getAccessToken: () => Promise<IAccessToken>
    getSpotifyAuthUrl: () => Promise<string>
    search: (query: string, token: string) => Promise<ISearchResponse>
}