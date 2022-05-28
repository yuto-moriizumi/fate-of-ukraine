import { Diplomacy } from '../diplomacy/Diplomacy';
import { DiplomacyFactory } from '../diplomacy/DiplomacyFactory';
import { DiplomacyJson, SaveDataType } from '../type/JsonType';
import { Serializable } from './Serializable';

export class DiplomacySet extends Set<Diplomacy> implements Serializable {
  public toJson(as: SaveDataType) {
    return Array.from(this).map((v) => {
      return v.toJson(as);
    });
  }

  public loadJson(json: DiplomacyJson[]) {
    json.forEach((v) => this.add(DiplomacyFactory.fromJson(v)));
    return this;
  }
}
