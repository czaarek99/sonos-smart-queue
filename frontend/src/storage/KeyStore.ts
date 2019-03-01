import { observable } from "mobx";

export class KeyStore<T> {

    private readonly implementation: Storage;
    private readonly path: string;
    @observable private version = 0;

    constructor(implementation: Storage, path: string) {
        this.implementation = implementation;
        this.path = path;
    }

    private getFullPath(key: string) : string {
        return `${this.path}.${key}`
    }

    public setKeyValue(key: keyof T, value: string) : void {
        const fullPath = this.getFullPath(key.toString());
        this.implementation.setItem(fullPath, value);
        this.version++;
    }

    public getKeyValue(key: keyof T) : string {
        const fullPath = this.getFullPath(key.toString());
        return this.implementation.getItem(fullPath);
    }

}