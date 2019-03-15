import { ISmartQueueController } from "../interfaces/controllers/SmartQueueController";
import { observable, computed } from "mobx";
import { IQueuedSong } from "../interfaces/services/QueueService";
import { ISpeakerGroup } from "../interfaces/services/InfoService";
import { AppController } from "./AppController";

export class SmartQueueController implements ISmartQueueController {

	private readonly appController: AppController;
	@observable public loading = true;

	constructor(appController: AppController) {
		this.appController = appController;
		this.load();
	}

	@computed get groupId() : string {
		return this.appController.getGroupId();
	}

	@computed get queueItems() : IQueuedSong[] {
		return this.appController.getQueue();
	}

	private async load() : Promise<void> {
		await this.refreshQueue();
	}

	public async refreshQueue() : Promise<void> {
		this.appController.refreshQueue();
	}
	
}