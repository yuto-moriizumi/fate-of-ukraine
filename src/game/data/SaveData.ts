import { SaveDataJson, SaveDataType } from '../type/JsonType';
import { Serializable } from '../util/Serializable';
import { Country } from './Country';
import { Province } from './Provice';
import { EventBase } from '../event/EventBase';

export class SaveData implements Serializable {
  public readonly countries = new Map<string, Country>();
  public readonly provinces = new Map<string, Province>();
  public readonly events = new Map<string, EventBase>();

  constructor(json?: SaveDataJson) {
    if (json) this.loadJson(json);
  }

  public toJson(as: SaveDataType): SaveDataJson {
    return {
      countries: Object.fromEntries(
        Array.from(this.countries).map(([id, country]: [string, Country]) => [
          id,
          country.toJson(as),
        ])
      ),
      provinces: Object.fromEntries(
        Array.from(this.provinces).map(([id, province]: [string, Province]) => [
          id,
          province.toJson(as),
        ])
      ),
    };
  }

  public loadJson(json: SaveDataJson) {
    if (json.countries) {
      Object.entries(json.countries).forEach(([key, value]) =>
        this.countries.set(
          key,
          (this.countries.get(key) ?? new Country(key)).loadJson(value)
        )
      );
      console.log('gamedata countries loaded:', this.countries);
    }
    if (json.provinces) {
      Object.entries(json.provinces).forEach(([key, value]) =>
        this.provinces.set(
          key,
          (this.provinces.get(key) ?? new Province(key)).loadJson(value)
        )
      );
      console.log('gamedata provinces loaded:', this.provinces);
    }
    return this;
  }

  public download(as: SaveDataType) {
    const jsonObject = this.toJson(as);
    console.log(jsonObject);
    const json = JSON.stringify(jsonObject);
    const blob = new Blob([json], {
      type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = as + '.json';
    a.click();
  }
}
