import { IGroupChooserController } from "../interfaces/controllers/GroupChooserController";
import { AppController } from "./AppController";
import { observable, computed } from "mobx";
import { ISpeakerGroup } from "../interfaces/services/InfoService";

export class GroupChooserController implements IGroupChooserController {

	@observable private readonly appController: AppController;

	constructor(appController: AppController) {
		this.appController = appController;
	}

	@computed get groups() {
		return this.appController.getGroups();
	}

	public onSelect(id: string) : void {
		this.appController.setGroupId(id);
	}

	@computed get selectedId() {
		return this.appController.getGroupId();
	}

}