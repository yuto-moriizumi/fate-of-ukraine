import { ProvinceScheme } from '../type/ProvinceScheme';
import { Country } from './Country';
import { Province } from './Provice';

export class SaveData {
  public countries!: Set<Country>;
  private _provinces!: Map<string, Province>;

  constructor(json?: object) {
    if (json) this.load(json);
  }

  public load(json: object) { Object.assign(this, json); }

  private set provinces(provinces: ProvinceScheme) {
    Object.entries(provinces.provinces).forEach(([key, value]) =>
      this._provinces.set(key, Object.assign(new Province(key), value))
    );
    console.log('gamedata provinces loaded:', this._provinces);
  }

  public toJson(as: "GameData" | "SaveData") {
    if (as == "GameData") {
      return JSON.stringify(this);
    } else {
      return JSON.stringify(this);
    }
  }
}
