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
  toJson(as: SaveDataType): Json;
  loadJson(json: Json): Serializable;
}
