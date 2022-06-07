import { Country } from '../data/Country';
import { data } from '../GameManager';
import { DiplomacyJson, SaveDataType } from '../type/JsonType';
import { Serializable } from '../util/Serializable';

export abstract class Diplomacy implements Serializable {
  public static readonly root_icon: string;
  public static readonly target_icon: string;
  _root: string;
  _target: string;

  constructor(root: string, target: string) {
    this._root = root;
    this._target = target;
  }

  public get root() {
    return data().countries.get(this._root);
  }
  public get target() {
    return data().countries.get(this._target);
  }

  public has(country: Country) {
    return country.id == this._root || country.id == this._target;
  }

  public getOpponent(country: Country) {
    return country === this.root ? this.target : this.root;
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
