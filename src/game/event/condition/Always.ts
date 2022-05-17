import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { AlwaysJson, SaveDataType, SAVEDATA_TYPE } from '../../type/JsonType';
import Condition from './Condition';

export class Always extends Condition {
  private always = true;
  public isValid(country: Country, date: Dayjs): boolean {
    return this.always;
  }
  public toJson(as: SaveDataType): AlwaysJson {
    return { type: 'Always', always: this.always };
  }

  public loadJson(json: AlwaysJson) {
    this.always = json.always;
    return this;
  }
}
