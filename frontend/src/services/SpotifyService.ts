import { ISpotifyService, IAccessToken } from "../interfaces/services/SpotifyService";
import { FETCH_JSON_HEADERS } from "../constants";
import { request } from "./Client";

export class SpotifyService implements ISpotifyService {

    public async getAccessToken() : Promise<IAccessToken> {
        const response = await request("/spotify/token", "GET");
        return await response.json();
    }

    public async getSpotifyAuthUrl() : Promise<string> {
        const response = await request("/spotify/authUrl", "GET");
        return await response.text();
    }

    public async search(query: string, token: string) : Promise<any> {
        const params = new URLSearchParams();
        params.append("accessToken", token);

        const response = await request(`/spotify/search/${query}?${params.toString()}`, "GET");
        return response.text();
    }
}