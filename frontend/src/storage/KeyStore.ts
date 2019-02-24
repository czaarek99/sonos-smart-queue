export class KeyStore {

    private readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    getFullPath(key: string) : string {
        return `${this.path}.${key}`
    }

    setKeyValue(key: string, value: object) : void {
        const fullPath = this.getFullPath(key);
        localStorage.setItem(fullPath, JSON.stringify(value));
    }

    getKeyValue<T>(key: string) : T | null {
        const fullPath = this.getFullPath(key);

        const item = localStorage.getItem(fullPath);
        if(item === null) {
            return null;
        }

        return JSON.parse(item);
    }

}