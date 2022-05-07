import { Country } from './Country';
import { Province } from './Provice';

export class SaveData {
  public countries!: Set<Country>;
  private _provinces!: Map<string, Province>;

  constructor(json: object) {
    Object.assign(this, json);
  }

  private set provinces(provinces: { [key: string]: object }) {
    Object.entries(provinces).forEach(([key, value]) =>
      this._provinces.set(key, Object.assign(new Province(key), value))
    );
    console.log('gamedata provinces loaded:', this._provinces);
  }
}
