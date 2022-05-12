import { DataType } from '../type/DataType';
import { ProvinceScheme } from '../type/ProvinceJson';
import { Country } from './Country';
import { Province } from './Provice';

export class SaveData {
  private countries = new Map<string, Country>();
  private _provinces = new Map<string, Province>();

  constructor(json?: object) {
    if (json) this.load(json);
  }

  public load(json: object) {
    Object.assign(this, json);
    return this;
  }

  private set provinces(provinces: ProvinceScheme) {
    Object.entries(provinces).forEach(([key, value]) =>
      this._provinces.set(key, Object.assign(new Province(key), value))
    );
    console.log('gamedata provinces loaded:', this._provinces);
  }

  public toJson(as: DataType) {
    if (as == 'GameData') {
      return JSON.stringify(this);
    } else {
      return JSON.stringify(this);
    }
  }

  public getProvinces() {
    return this._provinces;
  }

  public getCountries() {
    return this.countries;
  }
}
