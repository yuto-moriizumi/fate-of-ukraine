import { Country } from './Country';

export class Province {
  private id!: string;
  private owner!: Country;
  private x = 0;
  private y = 0;
  private neighbours = new Set<Province>();

  constructor(id: string) {
    this.id = id;
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
}
