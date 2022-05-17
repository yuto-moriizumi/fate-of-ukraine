import { Country } from '../data/Country';
import { data } from '../GameManager';
import { DiplomacyJson, SaveDataType } from '../type/JsonType';
import { Serializable } from '../util/Serializable';

export abstract class Diplomacy implements Serializable {
  public static readonly root_icon: string;
  public static readonly target_icon: string;
  _root!: string;
  _target!: string;
  private active = false;

  public get root() {
    return data().countries.get(this._root);
  }
  public get target() {
    return data().countries.get(this._root);
  }

  public getOpponent(country: Country) {
    return this.root === country ? this.target : this.root;
  }

  public activate() {
    if (this.active) return;
    this.active = true;
    // data().diplomacy.add(this);
  }

  public deactivate() {
    if (!this.active) return;
    this.active = false;
    // data().diplomacy.delete(this);
  }

  public abstract getRootIcon(): string;

  public abstract getTargetIcon(): string;

  public abstract toJson(as: SaveDataType): DiplomacyJson;

  public loadJson(json: DiplomacyJson) {
    this._root = json.root;
    this._target = json.target;
    return this;
  }
}
