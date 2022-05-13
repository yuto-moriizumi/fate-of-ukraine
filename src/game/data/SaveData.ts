import { SaveDataJson, SaveDataType, ProvinceJson } from '../type/JsonType';
import { Serializable } from '../util/Serializable';
import { Country } from './Country';
import { Province } from './Provice';

export class SaveData implements Serializable {
  private countries = new Map<string, Country>();
  private provinces = new Map<string, Province>();

  constructor(json?: SaveDataJson) {
    if (json) this.loadJson(json);
  }

  public toJson(as: SaveDataType): SaveDataJson {
    return {
      countries: Object.fromEntries(
        Object.entries(this.countries).map(
          ([id, country]: [string, Country]) => {
            return [id, country.toJson(as)];
          }
        )
      ),
      provinces: Object.fromEntries(
        Object.entries(this.provinces).map(
          ([id, province]: [string, Province]) => {
            return [id, province.toJson(as)];
          }
        )
      ),
    };
  }

  public loadJson(json: SaveDataJson) {
    if (json.provinces) {
      Object.entries(json.provinces).forEach(([key, value]) =>
        this.provinces.set(key, new Province(key).loadJson(value))
      );
      console.log('gamedata provinces loaded:', this.provinces);
    }
    if (json.countries) {
      Object.entries(json.countries).forEach(([key, value]) =>
        this.countries.set(key, new Country(key).loadJson(value))
      );
      console.log('gamedata countries loaded:', this.countries);
    }
    return this;
  }

  public getProvinces() {
    return this.provinces;
  }

  public getCountries() {
    return this.countries;
  }
}
