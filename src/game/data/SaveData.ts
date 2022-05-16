import { SaveDataJson, SaveDataType } from '../type/JsonType';
import { Serializable } from '../util/Serializable';
import { Country } from './Country';
import { Province } from './Provice';
import { EventBase } from '../event/EventBase';
import DiplomaticTie from '../DiplomaticTies/DiplomaticTie';
import { CountryMap } from '../util/CountryMap';

export class SaveData implements Serializable {
  public readonly countries = new CountryMap();
  public readonly provinces = new Map<string, Province>();
  public readonly events = new Map<string, EventBase>();
  public readonly diplomacy = new Set<DiplomaticTie>();

  constructor(json?: SaveDataJson) {
    if (json) this.loadJson(json);
  }

  public toJson(as: SaveDataType): SaveDataJson {
    return {
      countries: this.countries.toJson(as),
      provinces: Object.fromEntries(
        Array.from(this.provinces).map(([id, province]: [string, Province]) => [
          id,
          province.toJson(as),
        ])
      ),
      events: Object.fromEntries(
        Array.from(this.events).map(([id, event]: [string, EventBase]) => [
          id,
          event.toJson(as),
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
