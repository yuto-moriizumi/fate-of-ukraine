import JsonType from '../Utils/JsonType';
import { Country } from '../data/Country';
import { data } from '../GameManager';

export default abstract class DiplomaticTie {
  private type = this.constructor.name;
  public static readonly root_icon: string;
  public static readonly target_icon: string;
  protected root: Country;
  protected target: Country;
  protected active = false;
  constructor(root: Country, target: Country) {
    this.root = root;
    this.target = target;
  }

  public getRoot(): Country {
    return this.root;
  }

  public getTarget(): Country {
    return this.target;
  }

  public getOpponent(country: Country) {
    return this.getRoot() === country ? this.getTarget() : this.getRoot();
  }

  public activate() {
    if (this.active) return;
    this.active = true;
    data().diplomacy.add(this);
  }

  public deactivate() {
    if (!this.active) return;
    this.active = false;
    data().diplomacy.delete(this);
  }

  public abstract getRootIcon(): any;

  public abstract getTargetIcon(): any;

  replacer(key: string, value: any, type: JsonType) {
    if (value instanceof Country) return [key, value.id];
    if (key == 'active') return [key, false];
    return [key, value];
  }
}
