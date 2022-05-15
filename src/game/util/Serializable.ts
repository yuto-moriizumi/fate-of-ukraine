import {
  CountryJson,
  Dict,
  ProvinceJson,
  SaveDataJson,
  SaveDataProvinceJson,
  SaveDataType,
} from '../type/JsonType';

export interface Serializable {
  toJson(as: SaveDataType): object;
  loadJson(
    json:
      | SaveDataJson
      | Dict<CountryJson>
      | Dict<ProvinceJson>
      | CountryJson
      | SaveDataProvinceJson
      | ProvinceJson
  ): Serializable;
}
