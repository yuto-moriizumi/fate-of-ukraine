import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { CONDITION_TYPE, OwnProvinceJson } from '../../type/JsonType';
import Condition from './Condition';

export default class OwnProvince extends Condition {
  private province!: string;

  public isValid(country: Country): boolean {
    const province = data().provinces.get(this.province);
    return province?.owner == country;
  }

  public toJson(): OwnProvinceJson {
    return {
      type: CONDITION_TYPE.OWN_PROVINCE,
      province: this.province,
    };
  }

  public loadJson(json: OwnProvinceJson) {
    this.province = json.province;
    return this;
  }
}
