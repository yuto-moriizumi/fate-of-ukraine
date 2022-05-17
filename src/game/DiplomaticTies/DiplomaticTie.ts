import { Country } from '../data/Country';
import { data } from '../GameManager';
import {
  DiplomacyJson,
  DIPLOMACY_TYPE,
  SaveDataType,
  SAVEDATA_TYPE,
} from '../type/JsonType';
import { Serializable } from '../util/Serializable';
import { Access } from './Access';
import { Alliance } from './Alliance';
import { War } from './War';

export abstract class DiplomaticTie implements Serializable {
  private type = this.constructor.name;
  public static readonly root_icon: string;
  public static readonly target_icon: string;
  protected _root!: string;
  protected _target!: string;
  protected active = false;

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
    data().diplomacy.add(this);
  }

  public deactivate() {
    if (!this.active) return;
    this.active = false;
    data().diplomacy.delete(this);
  }

  public abstract getRootIcon(): any;

  public abstract getTargetIcon(): any;

  public abstract toJson(as: SaveDataType): DiplomacyJson;

  public loadJson(json: DiplomacyJson) {
    this._root = json.root;
    this._target = json.target;
    return this;
  }

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
