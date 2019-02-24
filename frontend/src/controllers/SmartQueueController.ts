import { ISmartQueueController } from "../interfaces/controllers/SmartQueueController";
import { observable } from "mobx";
import { IRootStore } from "../interfaces/stores/RootStore";
import { IQueuedSong } from "../interfaces/services/QueueService";
import { ISpeakerGroup } from "../interfaces/services/InfoService";

export class SmartQueueController implements ISmartQueueController {

    private readonly rootStore: IRootStore;
    @observable public speakerGroups: ISpeakerGroup[] = [];
    @observable public queueItems: IQueuedSong[] = [];
    @observable public loading = true;
    @observable public groupId = "test";

    constructor(rootStore: IRootStore) {
        this.rootStore = rootStore;
        this.load();
    }

    private async load() {
        this.queueItems = await this.rootStore.services.queueService.getQueue(this.groupId);
        this.speakerGroups = await this.rootStore.services.infoService.getGroups();
    }
    
}