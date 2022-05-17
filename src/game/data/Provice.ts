import { MapViewport } from '../container/MapViewport';
import { data } from '../GameManager';
import {
  ProvinceJson,
  SaveDataProvinceJson,
  SaveDataType,
  SAVEDATA_TYPE,
} from '../type/JsonType';
import { Serializable } from '../util/Serializable';
import { Country } from './Country';

export class Province implements Serializable {
  public readonly id!: string;
  private _name!: string;
  private ownerId!: string | undefined;
  private x = 0;
  private y = 0;

  constructor(id: string) {
    this.id = id;
  }

  public get owner() {
    if (this.ownerId) return data().countries.get(this.ownerId);
  }
  public set owner(owner: Country | undefined) {
    this.ownerId = owner?.id;
    MapViewport._instance.updateMap();
  }

  public get name() {
    return this._name;
  }

  public isNextTo(province: Province): boolean {
    // return this._neighbours.some((p) => p === province.getId());
    return true;
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
        };
      case SAVEDATA_TYPE.SAVEDATA:
        return { owner: this.ownerId };
    }
    return undefined;
  }

  public loadJson(json: ProvinceJson) {
    if ('name' in json) {
      this._name = json.name;
      this.x = json.x;
      this.y = json.y;
      this.ownerId = (json as SaveDataProvinceJson).owner;
    } else if ('owner' in json) this.ownerId = json.owner;
    return this;
  }
}
