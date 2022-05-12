export interface Serializable {
    toJson(as: JsonType): string;
}

type JsonType = "GameData" | "SaveData";