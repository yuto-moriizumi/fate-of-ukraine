import { DiplomacyJson, DIPLOMACY_TYPE, SaveDataType } from '../type/JsonType';
import { Diplomacy } from './Diplomacy';

/**
 * root国がtarget国に軍事通行権を持つことを表す
 * @export
 * @class Access
 * @extends {Diplomacy}
 */
export class Access extends Diplomacy {
  public static readonly root_icon = 'assets/access_root.png';
  public static readonly target_icon = 'assets/access_target.png';

  public getRootIcon() {
    return Access.root_icon;
  }
  public getTargetIcon() {
    return Access.target_icon;
  }

  toJson(as: SaveDataType): DiplomacyJson {
    return {
      type: DIPLOMACY_TYPE.ACCESS,
      root: this._root,
      target: this._target,
    };
  }
}
