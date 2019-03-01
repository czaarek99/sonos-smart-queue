import { IInfoService, ISpeakerGroup } from "../interfaces/services/InfoService";
import { request } from "./Client";

export class InfoService implements IInfoService {

    public async getGroups() : Promise<ISpeakerGroup[]> {
        const response = await request("/info/groups", "GET");
        return await response.json();
    }

}