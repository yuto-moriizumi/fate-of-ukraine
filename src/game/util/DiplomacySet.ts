import { Diplomacy } from '../diplomacy/Diplomacy';
import { DiplomacyFactory } from '../diplomacy/DiplomacyFactory';
import { DiplomacyJson, SaveDataType } from '../type/JsonType';
import { Serializable } from './Serializable';

export class DiplomacySet extends Set<Diplomacy> implements Serializable {
  private readonly observers = new Set<Observer>();

  public addObserver(observer: Observer) {
    this.observers.add(observer);
  }
  public removeObserver(observer: Observer) {
    this.observers.delete(observer);
  }

  public add(val: Diplomacy) {
    super.add(val);
    this.observers.forEach((observer) => observer(val));
    return this;
  }

  public delete(val: Diplomacy) {
    const res = super.delete(val);
    if (!res) return res;
    this.observers.forEach((observer) => observer());
    return res;
  }

  public clear(): void {
    super.clear();
    this.observers.forEach((observer) => observer());
  }

  public toJson(as: SaveDataType) {
    return Array.from(this).map((v) => {
      return v.toJson(as);
    });
  }

  public loadJson(json: DiplomacyJson[]) {
    json.forEach((v) => this.add(DiplomacyFactory.fromJson(v)));
    console.log('diplomacy loaded', this);
    return this;
  }
}

type Observer = (val?: Diplomacy) => void;
