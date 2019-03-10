import { IGroupChooserController } from "../interfaces/controllers/GroupChooserController";
import { AppController } from "./AppController";
import { observable, computed } from "mobx";
import { ISpeakerGroup } from "../interfaces/services/InfoService";

export class GroupChooserController implements IGroupChooserController {

    private readonly appController: AppController;
    @observable public groups: ISpeakerGroup[] = [];
    @observable public loading = true;

    constructor(appController: AppController) {
        this.appController = appController;
        this.load();
    }

    public onSelect(id: string) : void {
        this.appController.setGroupId(id);
    }

    private async load() : Promise<void> {
        await this.refreshGroups();
        this.loading = false;
        
        window.setInterval(async () => {
            await this.refreshGroups();
        }, 15 * 1000)
    }

    private async refreshGroups() : Promise<void> {
        this.groups = await this.appController.getServices()
            .infoService.getGroups();
    }

    @computed get selectedId() {
        return this.appController.getGroupId();
    }

}