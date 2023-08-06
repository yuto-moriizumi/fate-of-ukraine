import { Json, SaveDataType } from '../type/JsonType';

export interface Serializable {
  toJson(as: SaveDataType): Json | undefined;
  loadJson(json: Json): Serializable;
}
