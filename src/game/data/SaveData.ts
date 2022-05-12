import { GameDataJson, JsonType, ProvinceJson } from '../type/JsonType';
import { Serializable } from '../util/Serializable';
import { Country } from './Country';
import { Province } from './Provice';

export class SaveData implements Serializable {
  private countries = new Map<string, Country>();
  private provinces = new Map<string, Province>();

  constructor(json?: GameDataJson) {
    if (json) this.loadJson(json);
  }

  public toJson(as: JsonType) {
    if (as == 'GameData') {
      return JSON.stringify(this);
    } else {
      return JSON.stringify(this);
    }
  }

  public loadJson(json: GameDataJson) {
    if (json.provinces) {
      Object.entries(json.provinces).forEach(([key, value]) =>
        this.provinces.set(key, Object.assign(new Province(key), value))
      );
      console.log('gamedata provinces loaded:', this.provinces);
    }
    if (json.countries) {
      Object.entries(json.countries).forEach(([key, value]) =>
        this.countries.set(key, Object.assign(new Country(key), value))
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
