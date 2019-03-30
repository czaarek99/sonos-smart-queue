import { ISmartQueueController } from "../interfaces/controllers/SmartQueueController";
import { observable, computed } from "mobx";
import { ISpeakerGroup } from "../interfaces/services/InfoService";
import { AppController } from "./AppController";
import { ISong } from "../interfaces/Song";

export class SmartQueueController implements ISmartQueueController {

	private readonly appController: AppController;
	@observable public loading = true;

	constructor(appController: AppController) {
		this.appController = appController;
	}

	@computed get groupId() : string {
		return this.appController.getGroupId();
	}

	@computed get queueItems() : ISong[] {
		return this.appController.getQueue();
	}
}