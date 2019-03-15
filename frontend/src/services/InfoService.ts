import { IInfoService, ISpeakerGroup } from "../interfaces/services/InfoService";
import { BaseService } from "./BaseService";

export class InfoService extends BaseService implements IInfoService {

	public async getGroups() : Promise<ISpeakerGroup[]> {
		const response = await this.client.get("/info/groups");
		return await response.json();
	}

}