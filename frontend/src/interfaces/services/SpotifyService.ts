export interface IAccessToken {
    token: string,
    expiresIn: number
}

interface ISpotifyFollowers {
    total: number
}

export interface ISpotifyImage {
    size: number,
    url: string
}

interface ISpotifyTracksInfo {
    total: number
}

interface ISpotifyBase {
    id: string
    name: string
}

interface ISpotifyArtist extends ISpotifyBase {
    images: ISpotifyImage[]
    followers: ISpotifyFollowers
}

interface ISpotifyAlbum extends ISpotifyBase {
    artists: ISpotifyArtist[]
    images: ISpotifyImage[]
    release_date: string
}

interface ISpotifyTrack extends ISpotifyBase {
    album: ISpotifyAlbum
    artists: ISpotifyArtist[]
    duration: number
    explicit: boolean
}

interface ISpotifyPlaylist extends ISpotifyBase {
    images: ISpotifyImage[]
    tracks: ISpotifyTracksInfo
}

interface ISpotifyTracks {
    items: ISpotifyTrack[]
}

interface ISpotifyAlbums {
    items: ISpotifyAlbum[]
}

interface ISpotifyArtists {
    items: ISpotifyArtist[]
}

interface ISpotifyPlaylists {
    items: ISpotifyPlaylist[]
}

export interface ISpotifySearchResponse {
    tracks: ISpotifyTracks
    albums: ISpotifyAlbums
    artists: ISpotifyArtists
    playlists: ISpotifyPlaylists
}

export interface ISpotifyService {
    getAccessToken: () => Promise<IAccessToken>
    getSpotifyAuthUrl: () => Promise<string>
    search: (query: string, token: string) => Promise<ISpotifySearchResponse>
}