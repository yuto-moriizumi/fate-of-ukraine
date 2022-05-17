import { Country } from '../data/Country';
import { DiplomacyJson, DIPLOMACY_TYPE, SaveDataType } from '../type/JsonType';
import { Diplomacy } from './Diplomacy';

export class War extends Diplomacy {
  public static readonly root_icon = 'assets/access_root.png';
  public static readonly target_icon = 'assets/access_target.png';

  public getRootIcon() {
    return War.root_icon;
  }
  public getTargetIcon() {
    return War.target_icon;
  }

  toJson(as: SaveDataType): DiplomacyJson {
    return { type: DIPLOMACY_TYPE.WAR, root: this._root, target: this._target };
  }
}
