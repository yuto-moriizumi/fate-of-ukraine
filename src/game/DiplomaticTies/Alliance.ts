import DiplomaticTie from './DiplomaticTie';

export default class Alliance extends DiplomaticTie {
  public static readonly root_icon = 'assets/access_root.png';
  public static readonly target_icon = 'assets/access_root.png';

  public getRootIcon() {
    return Alliance.root_icon;
  }
  public getTargetIcon() {
    return Alliance.target_icon;
  }
}
