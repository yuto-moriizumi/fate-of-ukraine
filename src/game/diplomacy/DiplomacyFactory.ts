import { DiplomacyJson, DIPLOMACY_TYPE } from '../type/JsonType';
import { Access } from './Access';
import { Alliance } from './Alliance';
import { War } from './War';

export class DiplomacyFactory {
  public static fromJson(json: DiplomacyJson) {
    switch (json.type) {
      case DIPLOMACY_TYPE.ACCESS:
        return new Access().loadJson(json);
      case DIPLOMACY_TYPE.ALLIANCE:
        return new Alliance().loadJson(json);
      case DIPLOMACY_TYPE.WAR:
        return new War().loadJson(json);
    }
  }
}
