import { ISmartQueueController } from "../interfaces/controllers/SmartQueueController";
import { observable, computed } from "mobx";
import { IQueuedSong } from "../interfaces/services/QueueService";
import { ISpeakerGroup } from "../interfaces/services/InfoService";
import { AppController } from "./AppController";

export class SmartQueueController implements ISmartQueueController {

    private readonly appController: AppController;
    @observable public speakerGroups: ISpeakerGroup[] = [];
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

    private async refreshGroups() : Promise<void> {
        this.speakerGroups = await this.appController.getServices()
            .infoService.getGroups();
    }

    private async load() : Promise<void> {
        await this.refreshGroups();
        await this.refreshQueue();
        
        window.setInterval(async () => {
            await this.refreshGroups();
        }, 15 * 1000)
    }

    public async refreshQueue() : Promise<void> {
        this.appController.refreshQueue();
    }
    
}