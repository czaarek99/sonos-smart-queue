import { IInfoService, ISpeakerGroup } from "../interfaces/services/InfoService";
import { FETCH_JSON_HEADERS } from "../constants";

export class InfoService implements IInfoService {

    public async getGroups() : Promise<ISpeakerGroup[]> {
        const response = await fetch("/info/groups", {
            method: "GET",
            headers: FETCH_JSON_HEADERS
        });

        return await response.json();
    }

}