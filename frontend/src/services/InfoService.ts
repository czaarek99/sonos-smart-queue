import { IInfoService, ISpeakerGroup } from "../interfaces/services/InfoService";
import { BaseService } from "./BaseService";
import { ISong } from "../interfaces/Song";

export class InfoService extends BaseService implements IInfoService {

	public async getGroups() : Promise<ISpeakerGroup[]> {
		const response = await this.client.get("/info/groups");
		return await response.json();
	}

	public async getCurrentlyPlaying(groupId: string) : Promise<ISong> {
		const response = await this.client.get("/info/playing/" + groupId);
		return await response.json();
	}

}