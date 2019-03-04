export interface IAccessToken {
    token: string,
    expiresIn: number
}

interface ISpotifyArtist {
    name: string
    id: string
}

interface ISpotifyAlbumImage {
    size: number,
    url: string
}

interface ISpotifyAlbum {
    id: string
    name: string
    artists: ISpotifyArtist[]
    images: ISpotifyAlbumImage[]
}

interface ISpotifyTrack {
    id: string
    name: string
    album: ISpotifyAlbum
    artists: ISpotifyArtist[]
    duration: number
    explicit: boolean
}

interface ISpotifyTracks {
    items: ISpotifyTrack[]
}

export interface ISpotifySearchResponse {
    tracks: ISpotifyTracks
}

export interface ISpotifyService {
    getAccessToken: () => Promise<IAccessToken>
    getSpotifyAuthUrl: () => Promise<string>
    search: (query: string, token: string) => Promise<ISpotifySearchResponse>
}