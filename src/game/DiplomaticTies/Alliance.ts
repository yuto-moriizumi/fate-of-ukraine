import { DiplomacyJson, DIPLOMACY_TYPE, SaveDataType } from '../type/JsonType';
import { DiplomaticTie } from './DiplomaticTie';

export class Alliance extends DiplomaticTie {
  public static readonly root_icon = 'assets/access_root.png';
  public static readonly target_icon = 'assets/access_root.png';

  public getRootIcon() {
    return Alliance.root_icon;
  }
  public getTargetIcon() {
    return Alliance.target_icon;
  }
  toJson(as: SaveDataType): DiplomacyJson {
    return {
      type: DIPLOMACY_TYPE.ALLIANCE,
      root: this._root,
      target: this._target,
    };
  }
}
