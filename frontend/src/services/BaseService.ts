import { FetchClient } from "../util/FetchClient";
import { FETCH_JSON_HEADERS } from "../constants";

export class BaseService {

    protected readonly client: FetchClient;

    constructor(accessToken: string) {
        this.client = new FetchClient({
            Authorization: accessToken,
            ...FETCH_JSON_HEADERS
        })
    }

}