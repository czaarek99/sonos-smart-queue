import { ISmartQueueController } from "../interfaces/controllers/SmartQueueController";
import { observable } from "mobx";
import { IQueuedSong } from "../interfaces/services/QueueService";
import { ISpeakerGroup } from "../interfaces/services/InfoService";
import { AppController } from "./AppController";

export class SmartQueueController implements ISmartQueueController {

    private readonly appController: AppController;
    @observable public speakerGroups: ISpeakerGroup[] = [];
    @observable public queueItems: IQueuedSong[] = [];
    @observable public loading = true;
    @observable public groupId = "test";

    constructor(appController: AppController) {
        this.appController = appController;
        this.load();
    }

    private async load() {
        const { queueService, infoService } = this.appController.getServices();
        this.queueItems = await queueService.getQueue(this.groupId);
        this.speakerGroups = await infoService.getGroups();
    }
    
}