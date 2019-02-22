export class KeyStore {

    private readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    setKeyValue(key: string, value: object) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getKeyValue<T>(key: string) : T | null {
        const item = localStorage.getItem(key);
        if(item === null) {
            return null;
        }

        return JSON.parse(item);
    }

}