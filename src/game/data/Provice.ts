import { MapViewport } from '../container/MapViewport';
import { data } from '../GameManager';
import { ProvinceJson, SaveDataType, SAVEDATA_TYPE } from '../type/JsonType';
import { Serializable } from '../util/Serializable';
import { Country } from './Country';

export class Province implements Serializable {
  public readonly id!: string;
  private _name!: string;
  private ownerId!: string | undefined;
  public x = 0;
  public y = 0;
  private _neighbors!: Set<string>;

  constructor(id: string) {
    this.id = id;
  }

  public get owner() {
    if (this.ownerId) return data().countries.get(this.ownerId);
  }

  public set owner(owner: Country | undefined) {
    this.ownerId = owner?.id;
    MapViewport.instance.updateMap();
  }

  public get name() {
    return this._name;
  }

  public get neighbors() {
    return [...this._neighbors]
      .map((id) => data().provinces.get(id))
      .filter((p) => p !== undefined) as Province[];
  }

  public isNextTo(province: Province): boolean {
    return [...this._neighbors].some((p) => p === province.id);
  }

  /**
   * このプロヴィンスに対して指定の国が平和的に進入可能か
   * @param {Country} country
   * @returns
   * @memberof Province
   */
  public hasPeaceAccess(country: Country) {
    // return (
    //   this._owner == country ||
    //   country.hasAccessTo(this._owner) || //軍事通行権があるか
    //   country.alliesWith(this._owner) //同盟しているか
    // );
    return true;
  }

  /**
   * このプロヴィンスに対して指定の国が何らかの手段で進入可能か
   * @param {Country} country
   * @memberof Province
   */
  public hasAccess(country: Country) {
    // return this.hasPeaceAccess(country) || this._owner.getWarInfoWith(country);
    return true;
  }

  public toJson(as: SaveDataType): ProvinceJson | undefined {
    switch (as) {
      case SAVEDATA_TYPE.GAMEDATA:
        return {
          name: this._name,
          x: this.x,
          y: this.y,
          neighbors: [...this._neighbors],
        };
      case SAVEDATA_TYPE.SAVEDATA:
        return { owner: this.ownerId };
    }
    return undefined;
  }

  public loadJson(json: ProvinceJson) {
    if ('x' in json) {
      this._name = json.name;
      this.x = json.x;
      this.y = json.y;
      this._neighbors = new Set(json.neighbors);
    } else if ('owner' in json) this.ownerId = json.owner;
    return this;
  }
}
