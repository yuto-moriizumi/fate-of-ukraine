import { DiplomacyJson, DIPLOMACY_TYPE } from '../type/JsonType';
import { Access } from './Access';
import { Alliance } from './Alliance';
import { War } from './War';

export class DiplomacyFactory {
  public static fromJson(json: DiplomacyJson) {
    switch (json.type) {
      case DIPLOMACY_TYPE.ACCESS:
        return new Access(json.root, json.target);
      case DIPLOMACY_TYPE.ALLIANCE:
        return new Alliance(json.root, json.target);
      case DIPLOMACY_TYPE.WAR:
        return new War(json.root, json.target);
    }
  }
}
