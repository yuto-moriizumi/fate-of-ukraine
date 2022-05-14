import { data } from '../GameManager';
import { ProvinceJson, SaveDataType } from '../type/JsonType';
import { Serializable } from '../util/Serializable';
import { Country } from './Country';

export class Province implements Serializable {
  private id!: string;
  private name!: string;
  private ownerId!: string | undefined;
  private x = 0;
  private y = 0;
  private neighbours = new Set<Province>();

  constructor(id: string) {
    this.id = id;
  }

  public get owner() {
    if (this.ownerId) return data().getCountries().get(this.ownerId);
  }
  public set owner(owner: Country | undefined) {
    this.ownerId = owner?.getId();
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

  public setOwner(owner: Country) {
    this.owner = owner;
  }

  public toJson(as: SaveDataType): ProvinceJson {
    return {
      name: this.name,
      x: this.x,
      y: this.y,
      owner: this.ownerId,
    };
  }

  public loadJson(json: ProvinceJson) {
    this.name = json.name;
    this.ownerId = json.owner;
    this.x = json.x;
    this.y = json.y;
    return this;
  }
}
