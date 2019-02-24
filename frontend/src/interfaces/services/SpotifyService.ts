export interface ISpotifyService {
    hasSpotifyLink: () => Promise<boolean>
    getSpotifyAuthUrl: () => Promise<string>
}