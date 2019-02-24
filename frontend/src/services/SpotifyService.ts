import { ISpotifyService } from "../interfaces/services/SpotifyService";
import { FETCH_JSON_HEADERS } from "../constants";

export class SpotifyService implements ISpotifyService {

    public async hasSpotifyLink() : Promise<boolean> {
        const response = await fetch("/spotify/link", {
            method: "GET",
            headers: FETCH_JSON_HEADERS
        });

        const data = await response.json();
        return data.exists;
    }


    public async getSpotifyAuthUrl() : Promise<string> {
        const response = await fetch("/spotify/authUrl", {
            method: "GET",
            headers: FETCH_JSON_HEADERS
        });

        return await response.text();
    }

}