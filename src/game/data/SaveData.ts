import type { SaveDataJson, SaveDataType } from '../type/JsonType';
import type { Serializable } from '../util/Serializable';
import type { Diplomacy } from '../diplomacy/Diplomacy';
import { CountryMap } from '../util/CountryMap';
import { ProvinceMap } from '../util/ProvinceMap';
import { EventMap } from '../util/EventMap';
import { DiplomacyFactory } from '../diplomacy/DiplomacyFactory';
import { DiplomacySet } from '../util/DiplomacySet';

export class SaveData implements Serializable {
  public readonly countries = new CountryMap();
  public readonly provinces = new ProvinceMap();
  public readonly events = new EventMap();
  public readonly diplomacy = new DiplomacySet();

  constructor(json?: SaveDataJson) {
    if (json) this.loadJson(json);
  }

  public toJson(as: SaveDataType): SaveDataJson {
    return {
      countries: this.countries.toJson(as),
      provinces: this.provinces.toJson(as),
      events: this.events.toJson(as),
      diplomacy: this.diplomacy.toJson(as),
    };
  }

  public loadJson(json: SaveDataJson) {
    if (json.countries) this.countries.loadJson(json.countries);
    if (json.provinces) this.provinces.loadJson(json.provinces);
    if (json.events) this.events.loadJson(json.events);
    if (json.diplomacy) this.diplomacy.loadJson(json.diplomacy);
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
