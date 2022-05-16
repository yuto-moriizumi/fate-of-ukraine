import DiplomaticTie from './DiplomaticTie';

/**
 * root国がtarget国に軍事通行権を持つことを表す
 * @export
 * @class Access
 * @extends {DiplomaticTie}
 */
export default class Access extends DiplomaticTie {
  public static readonly root_icon = 'assets/access_root.png';
  public static readonly target_icon = 'assets/access_target.png';

  public getRootIcon() {
    return Access.root_icon;
  }
  public getTargetIcon() {
    return Access.target_icon;
  }
}
