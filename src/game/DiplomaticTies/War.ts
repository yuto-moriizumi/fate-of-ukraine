import { Country } from '../data/Country';
import DiplomaticTie from './DiplomaticTie';

export default class War extends DiplomaticTie {
  public static readonly root_icon = 'assets/access_root.png';
  public static readonly target_icon = 'assets/access_target.png';

  constructor(root: Country, target: Country) {
    super(root, target);
  }

  public getRootIcon() {
    return War.root_icon;
  }
  public getTargetIcon() {
    return War.target_icon;
  }
}
