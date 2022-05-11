import { ProvinceScheme } from '../type/ProvinceScheme';
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
  }

  private set provinces(provinces: ProvinceScheme) {
    Object.entries(provinces).forEach(([key, value]) =>
      this._provinces.set(key, Object.assign(new Province(key), value))
    );
    console.log('gamedata provinces loaded:', this._provinces);
  }

  public getProvinces() {
    return this._provinces;
  }

  public getCountries() {
    return this.countries;
  }
}
