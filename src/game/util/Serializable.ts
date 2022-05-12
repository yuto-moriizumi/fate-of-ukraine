import { GameDataJson, JsonType } from '../type/JsonType';

export interface Serializable {
  toJson(as: JsonType): string;
  loadJson(json: GameDataJson): Serializable;
}
