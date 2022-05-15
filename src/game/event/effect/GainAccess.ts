import Effect from "./Effect";
import Country from "../../Country";
import GameManager from "../../GameManager";
import Access from "../../DiplomaticTies/Access";
import JsonType from "../../Utils/JsonType";

export default class GainAccess extends Effect {
  private type = this.constructor.name;
  private _root: Country;
  private _target: Country;

  public activate() {
    const access = new Access(this._root, this._target);
    access.activate();
  }

  set root(countryId: string) {
    this._root = GameManager.instance.data.getCountry(countryId);
  }

  set target(countryId: string) {
    this._target = GameManager.instance.data.getCountry(countryId);
  }

  replacer(key: string, value: any, type: JsonType) {
    if (value instanceof Country) return [key, value.id];
    return [key, value];
  }
}
