import { IRootStore } from "../interfaces/stores/RootStore";

export abstract class AbstractStore {

    public readonly rootStore: IRootStore;

    constructor(rootStore: IRootStore) {
        this.rootStore = rootStore;
    }

}