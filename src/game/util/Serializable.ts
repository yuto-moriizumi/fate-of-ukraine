import {
  CountryJson,
  Dict,
  Json,
  ProvinceJson,
  SaveDataJson,
  SaveDataProvinceJson,
  SaveDataType,
} from '../type/JsonType';

export interface Serializable {
  toJson(as: SaveDataType): Json | undefined;
  loadJson(json: Json): Serializable;
}
