import { ISpotifyService, IAccessToken } from "../interfaces/services/SpotifyService";
import { BaseService } from "./BaseService";

export class SpotifyService extends BaseService implements ISpotifyService {

    public async getAccessToken() : Promise<IAccessToken> {
        const response = await this.client.get("/spotify/token");
        return await response.json();
    }

    public async getSpotifyAuthUrl() : Promise<string> {
        const response = await this.client.get("/spotify/authUrl");
        return await response.text();
    }

    public async search(query: string, token: string) : Promise<any> {
        const params = new URLSearchParams();
        params.append("accessToken", token);

        const response = await this.client.get(`/spotify/search/${query}?${params.toString()}`);
        return response.text();
    }
}