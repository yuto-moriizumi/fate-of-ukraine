import { Country } from "./Country";

export class SaveData {
    public countries!: Set<Country>;

    constructor(json: object) {
        Object.assign(this, json);
    }
}