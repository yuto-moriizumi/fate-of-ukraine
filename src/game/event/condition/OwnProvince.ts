import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { SaveDataType } from '../../type/JsonType';
import Condition from './Condition';

export default class OwnProvince extends Condition {
  private province!: string;

  public isValid(country: Country, date: Dayjs): boolean {
    const province = data().provinces.get(this.province);
    return province?.owner == country;
  }

  public toJson(as: SaveDataType) {
    return {
      ...super.toJson(as),
      province: this.province,
    };
  }

  public loadJson(json: any) {
    this.province = json.province;
  }
}
