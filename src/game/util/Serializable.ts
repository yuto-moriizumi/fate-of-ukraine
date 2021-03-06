import {
  CountryDictJson,
  CountryJson,
  ProvinceDictJson,
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
      | CountryDictJson
      | ProvinceDictJson
      | CountryJson
      | SaveDataProvinceJson
      | ProvinceJson
  ): Serializable;
}
